import React, { useState, useEffect } from 'react';
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

const CalendarWeekView = ({ userId, selectedDate, onDaySelect }) => {
  const [weekWorkouts, setWeekWorkouts] = useState({});

  useEffect(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const workoutsRef = ref(database, `workouts/${userId}`);
    const unsubscribe = onValue(workoutsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const filteredWorkouts = Object.entries(data).reduce((acc, [date, workout]) => {
        const workoutDate = new Date(date);
        if (workoutDate >= startOfWeek && workoutDate <= endOfWeek) {
          acc[date] = workout;
        }
        return acc;
      }, {});
      setWeekWorkouts(filteredWorkouts);
    });

    return () => unsubscribe();
  }, [userId, selectedDate]);

  const renderWeekDays = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => {
      const currentDate = new Date(selectedDate);
      currentDate.setDate(selectedDate.getDate() - selectedDate.getDay() + index + 1);
      const dateString = currentDate.toISOString().split('T')[0];
      const workout = weekWorkouts[dateString];
      
      const dayClass = workout
        ? workout.completed
          ? 'completed-workout'
          : 'planned-workout'
        : '';
      
      return (
        <div 
          key={day} 
          className={`day-column ${dayClass}`}
          onClick={() => onDaySelect(dateString)}
        >
          <div className="day-header">{day}</div>
          <div className="day-number">{currentDate.getDate()}</div>
          {workout && (
            <div className={`workout-indicator ${workout.completed ? 'completed' : ''}`} />
          )}
        </div>
      );
    });
  };

  return (
    <div className="calendar-week-view">
      {renderWeekDays()}
    </div>
  );
};

export default CalendarWeekView;