const DateEntry = {
  props: ['date', 'isShopping', 'holiday', 'shoppingUntil2PM'],
  computed: {
    iconUrl() {
      return `/img/${this.isShopping ? 'cart' : 'family'}.svg`;
    },
    formattedDate() {
      return (new Date(this.date)).toLocaleDateString();
    },
    type() {
      if (this.holiday) {
        return this.holiday;
      }

      return this.isShopping ? 'niedziela handlowa' : 'wolna niedziela';
    },
  },
  template: /*html*/`
    <div class="date-entry">
      <img
        class="date-entry__icon"
        :src="iconUrl"
      />
      <div class="date-entry__date">
        {{ formattedDate }}
      </div>
      <div
        class="date-entry__type"
        :class="{
          'date-entry__type--no-shopping': !isShopping ,
          'date-entry__type--holiday': holiday ,
        }"
      >
        {{ type }}
        <div
          class="date-entry__additional-info"
          v-if="shoppingUntil2PM"
        >
          handel do 14:00
        </div>
      </div>
    </div>
  `,
};

export default DateEntry;
