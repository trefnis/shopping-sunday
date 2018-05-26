import Menu from './Menu.js';
import DateList from './DateList.js';
import Reminders from './Reminders.js';

const App = {
  data() {
    return {
      currentView: 'date-list',
    };
  },
  methods: {
    changeCurrentView(newView) {
      this.currentView = newView;
    }
  },
  props: ['calendar'],
  components: { Menu, DateList, Reminders },
  template: `
    <div class="app-container">
      <Menu
        :activeItem="currentView"
        @selected-item="changeCurrentView"
      />
      <DateList
        v-show="currentView === 'date-list'"
        :calendar="calendar"
      />
      <Reminders
        v-show="currentView === 'reminders'"
      />
    </div>
  `,
};

export default App;
