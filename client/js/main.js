import calendar from './calendar.js';
import App from './components/App.js';

const app = new window.Vue({
  el: '#app',
  data: {
    calendar,
  },
  components: { App },
  template: `<App :calendar="calendar" />`,
});
