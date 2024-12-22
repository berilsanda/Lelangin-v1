// Combine Date and Time data
// Accepting Date and Time data as a string then returning as a Date Object
export default function combineDateTime(date: string, time: string): Date {
  let newDate = new Date(date);
  let newTime = new Date(time);

  // Setting a time data to a date
  newDate.setHours(newTime.getHours());
  newDate.setMinutes(newTime.getMinutes());
  newDate.setSeconds(newTime.getSeconds());
  newDate.setMilliseconds(newTime.getMilliseconds());

  return newDate;
}
