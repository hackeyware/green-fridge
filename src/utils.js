// Date helpers for the expiry priority system.

export const MS_PER_DAY = 86_400_000;

export function daysLeft(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${dateStr}T00:00:00`);
  return Math.round((expiry - today) / MS_PER_DAY);
}

// red = under 2 days, orange = under 5 days, green = 5 days or more
export function urgencyOf(days) {
  if (days < 2) return 'urgent';
  if (days < 5) return 'soon';
  return 'ok';
}

export function expiryLabel(days) {
  if (days < 0) return `Expired ${Math.abs(days)} day${days === -1 ? '' : 's'} ago`;
  if (days === 0) return 'Expires today';
  return `Expires in ${days} day${days === 1 ? '' : 's'}`;
}

export function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
