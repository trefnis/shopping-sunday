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
      console.log('edit');
    },
    delete(item) {
      console.log('delete');
    },
  },
  components: { Dropdown },
  props: ['long'],
  template: /*html*/`
    <div class="reminder-entry">
      <img
        class="reminder-entry__icon"
        src="/img/clock.svg"
      />
      <div class="reminder-entry__datetime">
        <span class="reminder-entry__time">13:30</span>
        <span class="reminder-entry__date">1 dzień przed</span>
      </div>
      <div
        class="reminder-entry__day-types"
        :class="{ 'reminder-entry__day-types--long': long }"
      >
        <span>wolną niedzielą</span>
        <span>niedzielą handlową</span>
        <span v-if="long">świętem</span>
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
  