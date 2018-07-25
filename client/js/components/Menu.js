const Menu = {
  methods: {
    select(item) {
      window.history.pushState({ view: item }, '');
      this.$emit('update:activeItem', item);
    },
  },
  props: ['activeItem'],
  template: /*html*/`
    <nav class="menu">
      <ul class="menu__list">
        <li
          class="menu__list-item"
          :class="{ active: activeItem === 'date-list' }"
          @click="select('date-list')"
        >
          Terminy
        </li>
        <li
          class="menu__list-item"
          :class="{ active: activeItem === 'reminders' }"
          @click="select('reminders')"
        >
          Przypomnienia
        </li>
      </ul>
    </nav>
  `
};

export default Menu;
