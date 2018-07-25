const ReminderEditor = {
  data() {
    const editedReminder = this.reminder.isNew ? {
      isNew: true,
      daysBefore: "1",
      time: null,
      remindNotShoppingSunday: true,
      remindShoppingSunday: false,
      remindHoliday: false,
    } : Object.assign({}, this.reminder);

    return { editedReminder };
  },
  props: ['reminder'],
  computed: {
    canSubmit() {
      const { 
        time,
        remindShoppingSunday,
        remindNotShoppingSunday,
        remindHoliday,
      } = this.editedReminder;

      return time && (remindShoppingSunday 
        || remindNotShoppingSunday 
        || remindHoliday);
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    save() {
      this.$emit('save', this.editedReminder);
    },
  },
  template: /*html*/`
    <form
      class="popup"
      @submit.prevent="save"
    >
      <div class="popup__wrapper">
        <div class="popup__header">
          <button type="button" @click="close">
            <img src="/img/return.svg" alt="wróć" />
          </button>
          {{ reminder.isNew ? 'Dodaj' : 'Zapisz' }} przypomnienie
        </div>

        <div class="reminder-editor">
          <div class="reminder-editor__item">
            <label for="daysBefore">Ile dni przed?</label>
            <select v-model="editedReminder.daysBefore" id="daysBefore">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>

          <div class="reminder-editor__item">
            <label for="time">O której godzinie?</label>
            <input
              id="time"
              type="time"
              v-model="editedReminder.time"
              required
            >
          </div>

          <div class="reminder-editor__item">
            <input
              id="remindNotShoppingSunday"
              type="checkbox"
              v-model="editedReminder.remindNotShoppingSunday"
            >
            <label for="remindNotShoppingSunday">
              Przypomnienie przed wolną niedzielą
            </label>
          </div>

          <div class="reminder-editor__item">
            <input
              id="remindShoppingSunday"
              type="checkbox"
              v-model="editedReminder.remindShoppingSunday"
            >
            <label for="remindShoppingSunday">
              Przypomnienie przed niedzielą handlową
            </label>
          </div>

          <div class="reminder-editor__item">
            <input
              id="remindHoliday"
              type="checkbox"
              v-model="editedReminder.remindHoliday"
            >
            <label for="remindHoliday">
              Przypomnienie przed świętem
            </label>
          </div>

          <input
            type="submit"
            value="Zapisz"
            :disabled="!canSubmit"
          />
        </div>
      </div>
  </form>
  `
};

export default ReminderEditor;