import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Typography } from '@/config/constant';

interface CountdownTimerProps {
  date: string | null;
}

// Display a countdown timer for auction end time
const CountdownTimer: React.FC<CountdownTimerProps> = ({ date }) => {
  // Return nothing if date is null
  if (date == null) {
    return;
  }

  // Initialize string props to a Date format
  const endDate = new Date(date);

  // Initialize timeUnits to display timer
  const [timeUnits, setTimeUnits] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Helper function to separate time difference between end date
  // and now date then set it to timeUnits state
  const calculateTimeUnits = (timeDifference: number) => {
    const seconds = Math.floor(timeDifference / 1000);
    setTimeUnits({
      days: Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60)),
      hours: Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)),
      minutes: Math.floor((seconds % (60 * 60)) / 60),
      seconds: seconds % 60,
    });
  };

  // Setup Timer and update the timer using useEffect
  // Call useEffect everytime timeUnits is changed
  useEffect(() => {
    // Function to update the countdown timer
    const updateCountdown = () => {
      const currentDate = new Date().getTime();
      const endTime = endDate.getTime();
      const timeDifference = endTime - currentDate;

      if (timeDifference <= 0) {
        // Countdown finished
        calculateTimeUnits(0);
        clearInterval(interval);
      } else {
        calculateTimeUnits(timeDifference);
      }
    };

    // Call updateCountdown function each second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  // Format one x digit time to 0x instead of x
  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerItem}>{formatTime(timeUnits.days)}</Text>
      <Text style={styles.timerItem}>:</Text>
      <Text style={styles.timerItem}>{formatTime(timeUnits.hours)}</Text>
      <Text style={styles.timerItem}>:</Text>
      <Text style={styles.timerItem}>{formatTime(timeUnits.minutes)}</Text>
      <Text style={styles.timerItem}>:</Text>
      <Text style={styles.timerItem}>{formatTime(timeUnits.seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerItem: {
    ...Typography.paragraph2,
    paddingHorizontal: 2,
  },
});

export default CountdownTimer;
