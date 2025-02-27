import { Timestamp } from 'firebase/firestore';

// Serialize Firestore Timestamp data
// to avoid error when used with redux or passing it as params
// between screens
//
// Accepting a Timestamp value then return a string or null value
export default function serializeTime(dateObject: Timestamp): string | null {
  // Return nothing if props is empty
  if (!dateObject) {
    return null;
  }
  const { seconds, nanoseconds } = dateObject;

  // Calculate miliseconds data then convert it to a Date and save it as ISO String value
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;
  const serializedDate = new Date(milliseconds).toISOString();

  return new Date(serializedDate).toISOString();
}
