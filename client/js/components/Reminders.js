import Loader from './Loader.js';
import { initialize as initializePushNotifications } from '../services/pushNotifications.js';

const Reminders = {
  data() {
    return {
      status: 'loading'
    };
  },
  computed: {
    disabled() {
      return this.status === 'disabled';
    },
    loading() {
      return this.status === 'loading';
    },
    ready() {
      return this.status === 'ready';
    },
    hasError() {
      return this.status === 'error';
    },
  },
  components: { Loader },
  async beforeMount() {
    const status = await initializePushNotifications();
    this.status = status;
  },
  template: /*html*/`
    <div :class="['reminders', { 'reminders--disabled': disabled }]">
      <div
        class="reminders__loader"
        v-if="loading"
      >
        <Loader />
      </div>
      <div v-if="ready">W trakcie pracy, będą dostępne w późniejszym czasie.</div>
        <div
        class="reminders__info-disabled"
        v-if="disabled"
        >
        Aby korzystać z przypomnień, musisz zezwolić aplikacji na wysyłanie powiadomień.
      </div>
      <div v-if="hasError">Wystąpił błąd. Następnym razem na pewno zadziała.</div>
    </div>
  `,
};

export default Reminders;
