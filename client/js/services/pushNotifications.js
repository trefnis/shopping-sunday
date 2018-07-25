const applicationServerPublicKey = 'BKqS2CQ60YDGYKwPj7ph1zpDIy2stNTGwvSjcXaEyq94F08adWAyt0n25bP5DRSTiUrul6rj0UbujZ-ZiILcjA0';

import { get, set, del } from 'https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval.mjs';

export async function initialize() {
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;

  let pushSubscription = await serviceWorkerRegistration.pushManager.getSubscription();
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
      pushSubscription = await subscribe();
    } catch (error) {
      return 'error';
    }
  }

  // Do it always to ensure that in case subscription changes, server is up to date.
  try {
    const { deviceId } = await updateSubscriptionOnServer(pushSubscription);
    await set('deviceId', deviceId);
  } catch (error) {
    return 'error';
  }

  return 'ready';
}

export async function subscribe() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    return await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
    throw error;
  }  
}

export async function unsubscribe() {
  await del('deviceId');

  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  const subscription = await serviceWorkerRegistration.getSubscription();
  if (subscription) {
    return subscribe.unsubscribe();
  }
}

async function updateSubscriptionOnServer(subscription) {
  const deviceId = await get('deviceId');
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (deviceId) {
    headers.deviceId = deviceId;
  }

  const response = await fetch(`${apiUrl}/subscribe`, {
    method: 'POST',
    body: JSON.stringify(subscription),
    mode: "cors",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to subscribe.`);
  }

  return await response.json();
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