const Reminder = {
  props: ['reminder'],
  mounted() {
    window.history.replaceState(null, '');
  },
  methods: {
    close() {
      window.history.back();
    }
  },
  computed: {
    icon() {
      const { isShopping } = this.reminder.day;

      const image = `/img/${isShopping ? 'cart' : 'family'}.svg`;
      const alt = isShopping ? 'wózek' : 'rodzina';

      return { image, alt };
    }
  },
  template: /*html*/`
   <div class="popup">
      <div class="popup__wrapper">
        <div class="popup__header">
          <button type="button" @click="close">
            <img src="/img/return.svg" alt="wróć" />
          </button>
        </div>
        <div class="reminder">
          <img :src="icon.image" :alt="icon.alt" />
          <p>
            {{ reminder.text }}
          </p>
        </div>
      </div>
    </div>
  `,
};

export default Reminder;