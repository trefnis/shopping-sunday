import Menu from './Menu.js';
import DateList from './DateList.js';

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
    Reminders: () => import('./Reminders.js'),
  },
  beforeMount() {
    const requiredApis = ['ServiceWorker', 'PushManager', 'Notification'];
    if (requiredApis.every(api => api in window)) {
      this.areNotificationsSupported = true;
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
