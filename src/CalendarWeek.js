import React, { useState, useEffect } from 'react';
import "./CalendarWeek.css";
import { ref, onValue,get } from 'firebase/database';
import DayView from './DayView';
import { database } from './firebase';


const Calendar = ({userId,viewBeforeReRender,setViewBeforeReRender,dateBeforeReRender,setDateBeforeReRender,setZaKalendar,setSelectedDateForEx}) => {
  const [date, setDatee] = useState(new Date());
  const [view, setView] = useState(viewBeforeReRender);
  const [selectedDate, setSelectedDate] = useState(dateBeforeReRender);
  const[areOnDay,setAreOnDay] = useState(false);
  const [isReset,setIsReset] = useState(false);
  const [workoutCompletedIn,setWorkoutCompletedIn] = useState(false);
  const [userWorkouts,setUserWorkouts]=useState([]);
  const [userWorkoutsValues,setUserWorkoutsValues]=useState([]);

  const userWorkoutRef = ref(database,`workouts/${userId}`)
  useEffect(()=>
    {
      get(userWorkoutRef).then
      ((snapshot)=>
        {
          setUserWorkouts(Object.keys(snapshot.val()));
          setUserWorkoutsValues(Object.entries(snapshot.val()));
          console.log(userWorkoutsValues)
        })
      .catch();
    },[,view,userId]);
 

  const addDays = (d, days) => {
    const newDate = new Date(d);
    newDate.setDate(d.getDate() + days);
    return newDate;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthData = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getWeekData = () => {
    const startOfWeek = addDays(date, -((date.getDay() + 6) % 7)); // Start from Monday
    return Array(7).fill().map((elem, i) => addDays(startOfWeek, i));
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setDateBeforeReRender(day);
    setView('day');
    setViewBeforeReRender("day");
  };


  const FormatDate = (datum) =>
    { 
     let month = '' + (datum.getMonth() + 1),
      day = '' + datum.getDate(),
      year = datum.getFullYear();

      if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year,month,day].join("-");
    }



  const renderWeekView = () => (
    <div className="calendar-grid week-view">
      {getWeekData().map((day, index) => {
        const isToday = day.toDateString() === new Date().toDateString();
        const bgClass = index < 5 ? `weekday-bg-${index % 2 + 1}` : '';
        const isCompleted  = userWorkoutsValues.filter(element=>element[0].includes(FormatDate(day)));
        let isTrulyCompleted = false;
        const isActuallyCompleted = isCompleted.map((elem,ind)=>
          {
           isTrulyCompleted=elem[1].completed;
          });
        
        return (
          <div 
            key={index} 
            className={`calendar-cell ${bgClass} ${isToday ? 'today' : ''}${isTrulyCompleted ? 'selected' : ''}`}
            onClick={() => handleDayClick(day)}
          >
            <div className="weekday">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className={`${isTrulyCompleted?"datee":"date"}`}>{day.getDate()}</div>
            <div className="cell-content">
              {userWorkouts.includes(FormatDate(day)) ? (
                <svg className="icon" viewBox="0 0 24 24" fill={`${isTrulyCompleted?"none":"#46ffbc"}`} stroke={`${isTrulyCompleted?"#e3ffa8":"#46ffbc"}`} strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              ) : (
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMonthView = () => (
    <div className="calendar-grid month-view">

      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
        <div key={day} className="weekday-header">{day}</div>
      ))}
      
      {getMonthData().map((day, index) => {
        
        if (!day) return <div key={`empty-${index}`} className="calendar-cell"></div>;
        const isToday = day.toDateString() === new Date().toDateString();
        const isSelected = day.toDateString() === date.toDateString();
        const isCompleted  = userWorkoutsValues.filter(element=>element[0].includes(FormatDate(day)));
        let isTrulyCompleted = false;
        const isActuallyCompleted = isCompleted.map((elem,ind)=>
          {
           isTrulyCompleted=elem[1].completed;
          });
        
        console.log("is Completed "+ isActuallyCompleted)
        return (
          <div 
            key={index} 
            className={`calendar-cell ${isToday ? 'today' : ''} ${isTrulyCompleted ? 'selected' : ''}`}
            onClick={() => handleDayClick(day)}
          >
             {userWorkouts.includes(FormatDate(day))? 
             <svg className="icon" viewBox="0 0 24 24" fill={`${isTrulyCompleted?"none":"#46ffbc"}`} stroke={`${isTrulyCompleted?"#e3ffa8":"#46ffbc"}`}  strokeWidth="2">
               <circle cx="12" cy="12" r="10" />
              </svg>:<svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>}
            <div>{day.getDate()}</div>  
          </div>
        );
      })}
    </div>
  );

  

  const changeDate = (amount) => {
    const newDate = new Date(date);
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + amount * 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + amount);
    } else {
      newDate.setDate(newDate.getDate() + amount);
    }
    setDatee(newDate);
   
  /*  setSelectedDate(newDate);
    setView("week");
    setView("day");*/
  };
const handleReset = () =>
  {
    setIsReset(true);
    setWorkoutCompletedIn(false)
  }
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          className="view-toggle"
          onClick={() => {
            setView(view === 'week' ? 'month' : 'week');
            setViewBeforeReRender(view === 'week' ? 'month' : 'week');
            setSelectedDate(null);
            setDateBeforeReRender(null);
            setAreOnDay(false);
          }}
        >
          {view === 'day' ? 'Back' : (view === 'week' ? 'Month' : 'Week')}
        </button>
       {!areOnDay || !workoutCompletedIn?<div>
          {view!="day"&&<button onClick={() => changeDate(-1)} className="nav-button">
            &lt;
          </button>}
          <span className="current-date">
            {view === 'day'
              ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          {view!="day"&&<button onClick={() => changeDate(1)} className="nav-button">
            &gt;
          </button>}
        </div>
:<button className='view-toggle' onClick={handleReset}>Reset</button>}
      </div>
      <div>
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
        {view === 'day' && <DayView setView={setView} workoutCompletedIn={workoutCompletedIn} setWorkoutCompletedIn={setWorkoutCompletedIn} isReset={isReset} setIsReset={setIsReset} setAreOnDay={setAreOnDay} setZaKalendar={setZaKalendar} selectedDate={selectedDate} userId={userId}/>}
      </div>
    </div>
  );
};
export default Calendar;
