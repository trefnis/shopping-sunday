const Queue = require('bull');
const Sequelize = require('sequelize');
const moment = require('moment');
const webPush = require('web-push');
const dotenv = require('dotenv');

dotenv.config();

const db = require('../api/models/');

const Op = Sequelize.Op;

webPush.setVapidDetails(
  'mailto:michal.olchawa@netguru.pl',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function getCurrentTimeWindow() {
  const date = moment().tz('Europe/Warsaw');
  const from = date.format('HH:mm:ss');
  const to = date.add(59, 'seconds').format('HH:mm:ss');
  return { from, to };
}

const scheduleRemindersQueue = new Queue('schedule reminders');

scheduleRemindersQueue.process(async job => {
  const { from, to } = getCurrentTimeWindow();

  const reminders = await db.Reminder.findAll({
    where: {
      time: { [Op.between]: [from, to] },
    },
    include: [{ model: db.Device, as: 'device' }],
  });

  await Promise.all(reminders.map(reminder =>
    webPush.sendNotification(
      reminder.device.subscription,
      'Przypomnienie TODO',
      { TTL: 12 * 60 * 60 }
    )
  ));
});

scheduleRemindersQueue.add(null, { repeat: { cron: '0 * * * * wed,thu,fri,sat' } });
