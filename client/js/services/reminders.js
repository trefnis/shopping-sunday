export async function fetchReminders() {
  const response = await fetch(`${apiUrl}/reminders`, {
    method: 'GET',
    mode: "cors",
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to subscribe.');
  }

  return await response.json();
}

export async function addReminder(reminder) {
  const response = await fetch(`${apiUrl}/reminders`, {
    method: 'POST',
    body: JSON.stringify(reminder),
    mode: "cors",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to add reminder.`);
  }

  return await response.json();
}

export async function saveReminder(reminder) {
  const response = await fetch(`${apiUrl}/reminders/${encodeURIComponent(reminder.id)}`, {
    method: 'PUT',
    body: JSON.stringify(reminder),
    mode: "cors",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to save reminder.`);
  }

  return await response.json();
}

export async function deleteReminder(reminder) {
  const response = await fetch(`${apiUrl}/reminders/${encodeURIComponent(reminder.id)}`, {
    method: 'DELETE',
    mode: "cors",
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete reminder.`);
  }
}
