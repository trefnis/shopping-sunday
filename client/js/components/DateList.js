import DateEntry from './DateEntry.js';

const DateList = {
  computed: {
    today() {
      return (new Date()).toLocaleDateString();
    },
    validDateEntries() {
      return this.calendar.filter(({ date: rawDate }) => {
        const now = new Date();
        const date = new Date(rawDate);
        [now, date].forEach(date => date.setUTCHours(0, 0, 0, 0));
        return now.valueOf() <= date.valueOf();
      });
    },
  },
  props: ['calendar'],
  components: { DateEntry },
  template: /*html*/`
    <div class="date-list">
      <div class="list">
        <p class="list__header">Dzisiaj jest {{ today }}</p>
        <ul class="list__items">
          <li
            v-for="dateEntry in validDateEntries"
            class="list__item"
          >
            <DateEntry v-bind="dateEntry" />
          </li>
        </ul>
      </div>
    </div>
  `,
};

export default DateList;
