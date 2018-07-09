const Dropdown = {
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    select(item) {
      this.isOpen = false;
      this.$emit('selected', item);
    },
    checkFocus(event) {
      const container = event.currentTarget;
      const nextFocusedElement = event.relatedTarget;
      if (!container.contains(nextFocusedElement)) {
        this.isOpen = false;
      };
    },
  },
  props: ['items'],
  template: /*html*/`
    <div
      class="dropdown"
      @focusout="checkFocus"
    >
      <button
        class="dropdown__label"
        @click="toggle"
      >
        <slot name="label"></slot>
      </button>
      <ul
        class="dropdown__list"
        :class="{ visible: isOpen }"
      >
        <li v-for="item in items">
          <button
            class="dropdown__option"
            @click="select(item)"
          >
            <slot :item="item">
              {{ item }}
            </slot>
          </button>
        </li>
      </ul>
    </div>
  `,
};

export default Dropdown;