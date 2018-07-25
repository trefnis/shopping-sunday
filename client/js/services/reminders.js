import { get } from 'https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval.mjs';

async function getOptions(customOptions = { headers: {} }) {
  const deviceId = await get('deviceId');
  
  return Object.assign(customOptions, {
    mode: 'cors',
    headers: Object.assign({ deviceId }, customOptions.headers),
  });
}

async function apiFetch(url, options) {
  const mergedOptions = await getOptions(options);
  return fetch(url, mergedOptions);
}

export async function fetchReminders() {
  const response = await apiFetch(`${apiUrl}/reminders`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to subscribe.');
  }

  return await response.json();
}

export async function addReminder(reminder) {
  const response = await apiFetch(`${apiUrl}/reminders`, {
    method: 'POST',
    body: JSON.stringify(reminder),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to add reminder.`);
  }

  return await response.json();
}

export async function saveReminder(reminder) {
  const response = await apiFetch(`${apiUrl}/reminders/${encodeURIComponent(reminder.id)}`, {
    method: 'PUT',
    body: JSON.stringify(reminder),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to save reminder.`);
  }

  return await response.json();
}

export async function deleteReminder(reminder) {
  const response = await apiFetch(`${apiUrl}/reminders/${encodeURIComponent(reminder.id)}`, {
    method: 'DELETE',
    headers: {
      deviceId: await get('deviceId'),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete reminder.`);
  }
}
