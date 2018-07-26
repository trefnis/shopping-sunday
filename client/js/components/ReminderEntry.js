import Dropdown from './Dropdown.js';

const ReminderEntry = {
  data() {
    return {
      actions: [
        { icon: 'pencil', action: 'edit', text: 'Zmień' },
        { icon: 'trash-bin', action: 'delete', text: 'Usuń' },
      ]
    }
  },
  methods: {
    optionAction(item) {
      this[item.action](item);
    },
    edit(item) {
      this.$emit('edit');
    },
    delete(item) {
      this.$emit('delete');
    },
  },
  computed: {
    allDayTypes() {
      return this.reminder.remindShoppingSunday && 
        this.reminder.remindNotShoppingSunday &&
        this.reminder.remindHoliday;
    }
  },
  components: { Dropdown },
  props: ['reminder'],
  template: /*html*/`
    <div class="reminder-entry">
      <img
        class="reminder-entry__icon"
        src="/img/clock.svg"
        alt="przypomnienie"
      />

      <span class="reminder-entry__time">{{ reminder.time }}</span>

      <div
        class="reminder-entry__day-types"
        :class="{ 'reminder-entry__day-types--long': allDayTypes }"
      >
        <span class="reminder-entry__date">
          {{ reminder.daysBefore }}
          {{ reminder.daysBefore === '1' ? 'dzień' : 'dni' }} przed
        </span>
        <span
          class="reminder-entry__shopping-sunday"
          v-if="reminder.remindNotShoppingSunday"
        >
          wolną niedzielą
        </span>
        <span 
          class="reminder-entry__not-shopping-sunday"
          v-if="reminder.remindShoppingSunday"
        >
          niedzielą handlową
        </span>
        <span
          class="reminder-entry__holiday"
          v-if="reminder.remindHoliday"
        >
          świętem
        </span>
      </div>
      <div class="reminder-entry__options">
        <Dropdown
          :items="actions"
          @selected="optionAction"
        >
          <span slot="label">
            <img src="/img/dots.svg" />
          </span>
          <template slot-scope="{ item }">
            <div class="reminder-entry__option">
              <span>{{ item.text }}</span>
              <img :src="'/img/' + item.icon + '.svg'" alt="" />
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
  `,
};
  
export default ReminderEntry;
  