export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatCompactCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

export const formatDateRange = (start, end, options = {}) => {
  if (!start || !end) return 'Dates not set';

  const fmt = new Intl.DateTimeFormat('en-IN', {
    month: options.month || 'short',
    day: 'numeric',
    year: options.year ?? 'numeric',
  });

  return `${fmt.format(new Date(start))} - ${fmt.format(new Date(end))}`;
};

export const daysBetweenInclusive = (start, end) => {
  if (!start || !end) return 0;
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.round(diff / 86400000) + 1);
};

export const getTripStatus = (trip) => {
  const now = new Date();
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  if (now >= start && now <= end) return 'active';
  if (start > now) return 'upcoming';
  return 'completed';
};

export const formatShortDate = (date, options = {}) =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: options.weekday,
    month: options.month || 'short',
    day: 'numeric',
    year: options.year,
  }).format(new Date(date));
