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
      <p class="date-list__header">Dzisiaj jest {{ today }}</p>
      <ul class="date-list__items">
        <li
          v-for="dateEntry in validDateEntries"
          class="date-list__item"
          :class="{ marked: !dateEntry.isShopping }"
        >
          <DateEntry v-bind="dateEntry" />
        </li>
      </ul>
    </div>
  `,
};

export default DateList;
