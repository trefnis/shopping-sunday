const ReminderEditor = {
  data() {
    return {
      daysBefore: 1,
      time: null,
      remindNotShoppingSunday: true,
      remindShoppingSunday: false,
      remindHoliday: false,
    };
  },
  props: ['reminder'],
  methods: {
    close() {
      this.$emit('close');
    },
    save() {
      const { daysBefore, time, remindShoppingSunday, remindNotShoppingSunday} = this;
      const reminder = Object.assign({}, this.reminder, {
        daysBefore,
        time,
        remindShoppingSunday,
        remindNotShoppingSunday,
      });
      this.$emit('save', reminder);
    },
  },
  template: /*html*/`
    <form
      class="reminder-editor"
      @submit.prevent="save"
    >
      <div class="reminder-editor__wrapper">
        <div class="reminder-editor__header">
          <button type="button" @click="close">
            <img src="/img/return.svg" alt="wróć" />
          </button>
          {{ reminder.isNew ? 'Dodaj' : 'Zapisz' }} przypomnienie
        </div>
        <div class="reminder-editor__form">
          <div class="reminder-editor__form-item">
            <label form="daysBefore">Ile dni przed?</label>
            <select v-model="daysBefore" name="daysBefore">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div class="reminder-editor__form-item">
            <label for="time">O której godzinie?</label>
            <input name="time" type="time" v-bind="time">
          </div>
          <div class="reminder-editor__form-item">
            <input
              name="remindShoppingSunday"
              type="checkbox"
              v-bind="remindShoppingSunday"
            >
            <label for="remindShoppingSunday">
              Przypomnienie przed niedzielą handlową
            </label>
          </div>
          <div class="reminder-editor__form-item">
            <input
              name="remindNotShoppingSunday"
              type="checkbox"
              v-bind="remindNotShoppingSunday"
            >
            <label for="remindNotShoppingSunday">
              Przypomnienie przed wolną niedzielą
            </label>
          </div>
          <div class="reminder-editor__form-item">
            <input
              name="remindHoliday"
              type="checkbox"
              v-bind="remindHoliday"
            >
            <label for="remindHoliday">
              Przypomnienie przed świętem
            </label>
          </div>
          <input type="submit" value="Zapisz" />
        </div>
      </div>
  </form>
  `
};

export default ReminderEditor;