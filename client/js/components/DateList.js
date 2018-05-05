import DateEntry from './DateEntry.js';
import { formatDate } from '../utils.js';

const DateList = {
  computed: {
    today() {
      return formatDate(new Date());
    }
  },
  props: ['calendar'],
  components: { DateEntry },
  template: `
    <div class="date-list">
      <p class="date-list__header">Dzisiaj jest {{ today }}</p>
      <ul class="date-list__items">
        <li
          v-for="dateEntry in calendar"
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
