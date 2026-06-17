/**
 * Utility functions for date manipulation in IST (Indian Standard Time).
 */

// Returns the date string (YYYY-MM-DD) for a given date adjusted to IST (UTC +5:30)
export const getISTDateString = (dateInput?: Date | string): string => {
  const d = dateInput 
    ? (typeof dateInput === 'string' ? new Date(dateInput) : dateInput) 
    : new Date();
  
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }

  // Adjust to IST timezone (UTC+5.5) which is offset +330 minutes
  // We can convert to absolute UTC timestamp, then add 5.5 hours for IST.
  const utcEpoch = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istDate = new Date(utcEpoch + (3600000 * 5.5));
  
  const y = istDate.getFullYear();
  const m = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Returns a full ISO timestamp or custom timestamp for the specified date in IST
export const getISTTimestampForDate = (dateStr: string): string => {
  const todayStr = getISTDateString();
  if (dateStr === todayStr) {
    // Current time in system/browser to maintain precise logs
    return new Date().toISOString();
  }
  const now = new Date();
  const timePart = now.toTimeString().split(' ')[0]; // HH:MM:SS
  return `${dateStr}T${timePart}.000Z`;
};

// Generates an array of short formatted dates back from today/reference date in IST
export const getISTPastDateKeys = (daysToShow: number = 7): string[] => {
  const dates: string[] = [];
  const today = new Date();
  const utcEpoch = today.getTime() + (today.getTimezoneOffset() * 60000);
  
  // Starting from (daysToShow - 1) days ago to today
  for (let i = daysToShow - 1; i >= 0; i--) {
    const istTime = new Date(utcEpoch + (3600000 * 5.5));
    istTime.setDate(istTime.getDate() - i);
    
    const y = istTime.getFullYear();
    const m = String(istTime.getMonth() + 1).padStart(2, '0');
    const day = String(istTime.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
  }
  return dates;
};

export interface ISTTimeInfo {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  hour: number;
  minute: number;
}

// Returns the current time and day of week in Indian Standard Time (IST)
export const getISTTimeInfo = (): ISTTimeInfo => {
  const d = new Date();
  const utcEpoch = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istDate = new Date(utcEpoch + (3600000 * 5.5));
  
  return {
    dayOfWeek: istDate.getDay(),
    hour: istDate.getHours(),
    minute: istDate.getMinutes()
  };
};

// Maps 0-6 where 0 = Sunday to the daily target workout string
export const getDailyWorkoutTarget = (dayOfWeek: number): string | null => {
  switch (dayOfWeek) {
    case 1:
      return 'chest and back';
    case 2:
      return 'bicep tricep';
    case 3:
      return 'leg and shoulder';
    case 4:
      return 'chest and back';
    case 5:
      return 'abs legs';
    case 6:
      return 'full body';
    default:
      return null; // Sunday, or don't show
  }
};

