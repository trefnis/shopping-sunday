const Queue = require('bull');
const Sequelize = require('sequelize');
const moment = require('moment');
const webPush = require('web-push');
const dotenv = require('dotenv');

dotenv.config();

const db = require('../api/models/');
const calendar = require('../calendar');

const Op = Sequelize.Op;

webPush.setVapidDetails(
  'mailto:michal.olchawa@netguru.pl',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function getCurrentTimeWindow() {
  const now = moment().tz('Europe/Warsaw');

  const minutesRoundedDownTo10 = Math.floor(now.minutes() / 10) * 10;

  const from = now.clone().minutes(minutesRoundedDownTo10).seconds(0);
  const to = from.clone().add(9, 'minutes').seconds(59);

  return [from, to].map(date => date.format('HH:mm:ss'));
}

function getSundayOrHolidayAhead(daysAhead) {
  const currentDate = moment().tz('Europe/Warsaw');
  const dateAhead = currentDate.add(daysAhead, 'days');

  return calendar.find(({ date: rawDate }) => {
    const date = moment.tz(rawDate, 'Europe/Warsaw');
    return dateAhead.isSame(date, 'day');
  });
}

function getDateTypeQualifierProp(day) {
  if (day.holiday) {
    return 'remindHoliday'
  } else {
    return day.isShopping ? 
      'remindShoppingSunday' :
      'remindNotShoppingSunday';
  }
}

async function getReminders(day, daysBefore, timeWindow) {
  if (!day) return [];

  const dateTypeQualifierProp = getDateTypeQualifierProp(day);

  return db.Reminder.findAll({
    where: {
      daysBefore: { [Op.eq]: daysBefore },
      time: { [Op.between]: timeWindow },
      [dateTypeQualifierProp]: { [Op.eq]: true },
    },
    include: [{ model: db.Device, as: 'device' }],
  });
}

async function selectCurrentReminders(timeWindow, days) {
  return Promise.all(
    days.map(async ([day, daysAheadToday]) => ({
      day,
      daysAheadToday,
      reminders: await getReminders(day, daysAheadToday, timeWindow),
    }))
  ); 
}

function getReminderText(day, daysAheadToday) {
  const when = {
    1: 'Jutro',
    2: 'Pojutrze',
    3: 'Za 2 dni',
  }[daysAheadToday];

  if (day.holiday) {
    if (day.shoppingUntil2PM) {
      return `${when} jest ${day.holiday}. Pamiętaj, żeby zrobić zakupy przed 14:00!`;
    }
    return `${when} jest ${day.holiday}. Pamiętaj, żeby zrobić zakupy zawczasu, bo sklepy będą nieczynne.`
  } else {
    return day.isShopping ? 
      `${when} jest niedziela handlowa, sklepy będą otwarte. Uff!` :
      `${when} jest wolna niedziela. Pamiętaj, żeby zrobić zakupy zawczasu, bo sklepy będą nieczynne.`;
  }
}

async function sendReminders(remindersByDay, text) {
  return Promise.all(remindersByDay.map(({ reminders, day, daysAheadToday }) => 
    Promise.all(reminders.map(reminder =>
      webPush.sendNotification(
        reminder.device.subscription,
        JSON.stringify({
          text: getReminderText(day, daysAheadToday),
          day
        }),
        { TTL: 12 * 60 * 60 }
      )
    ))
  ));
}

async function performTask() {
  try {
    console.log('\n=== Sending reminders task started ===');

    const timeWindow = getCurrentTimeWindow();
    console.log(`Selecting reminders within: ${timeWindow[0]} - ${timeWindow[1]}`);

    const days = [1, 2, 3].map(daysAheadToday => 
      [getSundayOrHolidayAhead(daysAheadToday), daysAheadToday]
    );
    const daysLog = days.reduce((logMessage, [day]) => (
      day ? `${logMessage}\n${day.date}; is shopping? ${day.isShopping}; holiday? ${day.holiday || false}` : logMessage
    ), '');
    console.log(daysLog ? `Selecting reminders for given days: ${daysLog}\n` : 'There is no days to remind of in next 3 days.\n');

    const remindersByDay = await selectCurrentReminders(timeWindow, days);

    const allReminders = remindersByDay.reduce((aggregate, { reminders }) => aggregate.concat(reminders), []);
    console.log(`\nFound ${allReminders.length} reminders: ${allReminders.map(reminder => reminder.id)}`);

    console.log('Sending...');
    await sendReminders(remindersByDay);

    console.log('=== Sending reminders task finished ===\n');
    return db.sequelize.close();

  } catch (error) {
    console.error(error);
    console.error('=== Sending reminders task FAILED ===\n');

    setTimeout(() => {
      process.exit(1);
    }, 100);
  }
}

performTask();

module.exports = performTask;
