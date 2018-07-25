import Menu from './Menu.js';
import DateList from './DateList.js';
import Loader from './Loader.js';

const App = {
  data() {
    return {
      currentView: 'date-list',
      areNotificationsSupported: false,
      currentReminder: null,
    };
  },
  props: ['calendar'],
  components: { 
    Menu,
    DateList,
    Reminders: () => ({
      component: import('./Reminders.js'),
      loading: Loader,
      delay: 0,
    }),
    Reminder: () => ({
      component: import('./Reminder.js'),
      loading: Loader,
      delay: 100,
    }),
  },
  beforeMount() {
    const requiredApis = ['ServiceWorker', 'PushManager', 'Notification'];
    if (requiredApis.every(api => api in window)) {
      this.areNotificationsSupported = true;

      navigator.serviceWorker.addEventListener('message', this.handleIncomingReminders);
      window.addEventListener('popstate', this.navigate);
      
      const initialView = history.state;
      if (initialView) {
        this.navigate({ state: initialView });
      } else {
        window.history.replaceState({ view: this.currentView }, '');
      }

      this.handleInitialReminder();
    }
  },
  beforeDestroy() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.removeEventListener('message', this.handleIncomingReminders);
    }
    window.removeEventListener('popstate', this.navigate);
  },
  methods: {  
    handleInitialReminder() {
      const url = new URL(window.location.href);
      const serializedReminder = url.searchParams.get('reminder');

      if (serializedReminder) {
        const reminder = JSON.parse(serializedReminder);
        url.searchParams.delete('reminder');
        window.history.replaceState(window.history.state, '', url);
        this.openReminderView(reminder);
      }
    },
    handleIncomingReminders(event) {      
      if (event.data.type === 'notification-received') {
        this.openReminderView(event.data.reminder);
      }
    },
    openReminderView(reminder) {
      this.currentReminder = reminder;
      this.currentView = 'reminder';
      window.history.pushState({ view: this.currentView }, '');
    },
    navigate({ state }) {
      if (state && state.view) {
        if (this.currentView === 'reminder' && state.view !== 'reminder') {
          this.currentReminder = null;
        }

        this.currentView = state.view;
      }
    },
  },
  template: /*html*/`
    <div class="app-container">
      <Menu
        v-if="areNotificationsSupported"
        :activeItem.sync="currentView"
      />
      <DateList
        v-show="currentView === 'date-list'"
        :calendar="calendar"
      />
      <Reminders
        v-if="areNotificationsSupported && currentView === 'reminders'"
      />
      <Reminder
        v-if="currentView === 'reminder'"
        :reminder="currentReminder"
      />
    </div>
  `,
};

export default App;
