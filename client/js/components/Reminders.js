import Loader from './Loader.js';
import ReminderEditor from './ReminderEditor.js';
import ReminderEntry from './ReminderEntry.js';
import { initialize as initializePushNotifications } from '../services/pushNotifications.js';
import { fetchReminders, addReminder, saveReminder, deleteReminder } from '../services/reminders.js';

const Reminders = {
  data() {
    return {
      status: 'bootstrapping',
      editedReminder: null,
      reminders: [],
    };
  },
  components: { Loader, ReminderEditor, ReminderEntry },
  async beforeMount() {
    try {
      const status = await initializePushNotifications();
      if (status === 'ready') {
        this.reminders = await fetchReminders();
      }
      this.status = status;
    } catch (error) {
      console.error(error);
      this.status = 'error';
    }
  },
  computed: {
    showLoader() {
      return this.status === 'bootstrapping' || this.status === 'loading';
    },
    showList() {
      return this.status === 'ready' ||
        this.status === 'updateFailed' ||
        this.status === 'loading';
    },
  },
  methods: {
    async save(reminder) {
      this.status = 'loading';

      const { index, isNew } = reminder;

      delete reminder.index;
      delete reminder.isNew;
      
      try {
        if (isNew) {
          const newReminder = await addReminder(reminder);
          this.reminders.push(newReminder);
        } else {
          const newReminder = await saveReminder(reminder);
          this.$set(this.reminders, index, newReminder);
        }
        this.editedReminder = null;
      } catch (error) {
        console.error(error);
        this.failUpdate();
        this.reminders = previousReminders;
      } finally {
        this.status = 'ready';
      }
    },
    edit(reminder, index) {
      const editedReminder = Object.assign({}, reminder, { index });
      this.editedReminder = editedReminder;
    },
    async remove(reminder, index) {
      this.status = 'loading';

      try {
        await deleteReminder(reminder);
        this.reminders.splice(index, 1);
      } catch (error) {
        console.error(error);
        this.failUpdate();
      } finally {
        this.status = 'ready';
      }
    },
    openEditor(reminder) {
      this.editedReminder = reminder;
    },
    closeEditor() {
      this.editedReminder = null;
    },
    failUpdate() {
      this.status = 'updateFailed';
      setTimeout(() => {
        if (this.status === 'updateFailed') {
          this.status = 'ready';
        }
      }, 4000);
    },
  },
  template: /*html*/`
    <div class="reminders">
      <div
        class="reminders__loader"
        v-if="showLoader"
      >
        <Loader />
      </div>
      <div v-if="showList">
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
                @edit="edit(reminder, index)"
                @delete="remove(reminder, index)"
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
          @save="save"
          @close="closeEditor"
        />
      </div>
      <div
        class="reminders__info-disabled"
        v-if="status === 'disabled'"
        >
        Aby korzystać z przypomnień, musisz zezwolić aplikacji na wysyłanie powiadomień.
      </div>
      <p
        class="reminders__error"
        v-if="status === 'error' || status === 'updateFailed'"
      >
        Wystąpił błąd. Następnym razem na pewno zadziała.
      </p>
    </div>
  `,
};

export default Reminders;
