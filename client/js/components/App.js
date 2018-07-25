import Menu from './Menu.js';
import DateList from './DateList.js';
import Loader from './Loader.js';

const App = {
  data() {
    return {
      currentView: 'date-list',
      areNotificationsSupported: false,
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
  },
  beforeMount() {
    const requiredApis = ['ServiceWorker', 'PushManager', 'Notification'];
    if (requiredApis.every(api => api in window)) {
      this.areNotificationsSupported = true;

      navigator.serviceWorker.addEventListener('message', this.handleIncomingReminders);
    }
  },
  beforeDestroy() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.removeEventListener('message', this.handleIncomingReminders);
    }
  },
  methods: {
    handleIncomingReminders(event) {
      console.log('incoming reminder wooohoo');
      console.log(event.data);
      console.log(this);
    }
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
    </div>
  `,
};

export default App;
