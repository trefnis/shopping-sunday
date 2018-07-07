const applicationServerPublicKey = 'BB4H2AbYhtXOQx03enRL4vYh3ADEiIYsDMAtcckCjejq-pAp3sACJ9bh5tDJdl-RqAfd7QUXVYryeWkr8ejKlnw';

export async function initialize() {
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;

  const pushSubscription = await serviceWorkerRegistration.pushManager.getSubscription();
  const notificationPermissionStatus = await Notification.requestPermission();
  const isAlreadySubscribed = pushSubscription !== null;

  if (notificationPermissionStatus !== 'granted') {
    if (isAlreadySubscribed) {
      // Don't need to wait for this.
      unsubscribe();
    }
    return 'disabled';
  }

  if (!isAlreadySubscribed) {
    try {
      await subscribe();
    } catch (error) {
      return 'error';
    }
  }

  return 'ready';
}

export async function subscribe() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

  try {
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  const subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });
    await updateSubscriptionOnServer(subscription);
  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
    throw error;
  }  
}

export async function unsubscribe() {
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  const subscription = await serviceWorkerRegistration.getSubscription();
  if (subscription) {
    return subscribe.unsubscribe();
  }
}

function updateSubscriptionOnServer(subscription) {
  if (subscription === null) {
    // TODO: cleanup
  }

  // TODO: Send subscription to application server
  window.s = subscription;
  console.log(subscription);
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}