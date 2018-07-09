import Loader from './Loader.js';
import ReminderEditor from './ReminderEditor.js';
import ReminderEntry from './ReminderEntry.js';
import { initialize as initializePushNotifications } from '../services/pushNotifications.js';

const Reminders = {
  data() {
    return {
      // status: 'loading',
      status: 'ready',
      editedReminder: null,
      reminders: [],
    };
  },
  components: { Loader, ReminderEditor, ReminderEntry },
  async created() {
    // TODO: fetch reminders
  },
  // async beforeMount() {
  //   const status = await initializePushNotifications();
  //   this.status = status;
  // },
  methods: {
    async saveReminder(reminder) {
      const previousReminders = Array.from(this.reminders);
      const { index, isNew } = reminder;

      delete reminder.index;
      delete reminder.isNew;

      if (isNew) {
        this.reminders.push(reminder);
      } else {
        this.$set(this.reminders, index, reminder);
      }

      this.editedReminder = null;

      // TODO:
      // try {
      //   const deviceId = get from local storage
      //   await this.saveReminderRequest(reminder, deviceId);
      // } catch (error) {
      //   // handle error message
      //   this.reminders = previousReminders;
      // }
    },
    editReminder(reminder, index) {
      const editedReminder = Object.assign({}, reminder, { index });
      this.editedReminder = editedReminder;
    },
    deleteReminder(reminder, index) {
      this.reminders.splice(index, 1);

      // TODO:
      // try {
      //   const deviceId = get from local storage
      //   await this.deleteReminderRequest(reminder, deviceId);
      // } catch (error) {
      //   // handle error message
      //   this.reminders.splice(index, 0, reminder);
      // }
    },
    openEditor(reminder) {
      this.editedReminder = reminder;
    },
    closeEditor() {
      this.editedReminder = null;
    },
  },
  template: /*html*/`
    <div class="reminders">
      <div
        class="reminders__loader"
        v-if="this.status === 'loading'"
      >
        <Loader />
      </div>
      <div v-if="this.status === 'ready'">
        <!-- <div class="list">
          <ul class="list__items">
            <li
              class="list__item"
            >
              <ReminderEntry />
            </li>
            <li
              class="list__item"
            >
              <ReminderEntry long="true" />
            </li>
            <li
              class="list__item"
            >
              <ReminderEntry />
            </li>
          </ul>
        </div> -->
        <p
          class="reminders__nothing-added"
          v-if="reminders.length === 0"
        >
          Nie dodałeś jeszcze żadnych przypomnień.
        </p>
        <div class="list">
          <ul class="list__items">
            <li
              class="list__item"
              v-for="(reminder, index) in reminders"
            >
              <ReminderEntry
                :reminder="reminder"
                @edit="editReminder(reminder, index)"
                @delete="deleteReminder(reminder, index)"
              />
            </li>
          </ul>
        </div>
        <button
          class="reminders__add-button"
          v-if="!editedReminder"
          @click="openEditor({ isNew: true })"
        >
          <img src="/img/plus.svg" alt="dodaj" />
        </button>
        <ReminderEditor
          v-if="editedReminder"
          :reminder="editedReminder"
          @save="saveReminder"
          @close="closeEditor"
        />
      </div>
      <div
        class="reminders__info-disabled"
        v-if="this.status === 'disabled'"
        >
        Aby korzystać z przypomnień, musisz zezwolić aplikacji na wysyłanie powiadomień.
      </div>
      <div v-if="this.status === 'error'">Wystąpił błąd. Następnym razem na pewno zadziała.</div>
    </div>
  `,
};

export default Reminders;
