import calendar from './calendar.js';
import App from './components/App.js';

window.apiUrl = 'https://shoppingsunday.herokuapp.com';

const app = new window.Vue({
  el: '#app',
  data: {
    calendar,
  },
  components: { App },
  template: `<App :calendar="calendar" />`,
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('generated-service-worker.js');
}
