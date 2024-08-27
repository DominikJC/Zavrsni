import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import Calendar from './CalendarWeek';
import ExercisesList from './Exercises';
import CustomExerciseBuilder from './CustomExerciseBuilder';
import "./WorkoutPage.css";

    function WorkoutPage({ userId }) {
        const [selectedDate, setSelectedDate] = useState(new Date());
        const [kalendarIliLista,setZaKalendar] = useState(false);
        const [jeliCustom,setJeliCustom] = useState(false);
      const [viewBeforeReRender,setViewBeforeReRender] = useState("week");
      const [dateBeforeReRender,setDateBeforeReRender]=useState(null);
        const handleDaySelect = (date) => {
          setSelectedDate(new Date(date));
        };
      
        const handleClick = ()=>
          {
            if(kalendarIliLista)
              {
                setZaKalendar(false);
              }
            else
            {
              setZaKalendar(true);
            }
          }

        return (
          <div className="workout-page">
            <h1>Workout Calendar</h1>
            
            {jeliCustom && <CustomExerciseBuilder setJeliCustom={setJeliCustom} userId={userId}/>}
            {kalendarIliLista && !jeliCustom && <ExercisesList userId={userId} dateBeforeReRender={dateBeforeReRender} setZaKalendar={setZaKalendar} setJeliCustom={setJeliCustom}/>}
           {!kalendarIliLista && !jeliCustom &&
           <Calendar
            setZaKalendar={setZaKalendar}
            viewBeforeReRender={viewBeforeReRender} 
            setViewBeforeReRender={setViewBeforeReRender}
             dateBeforeReRender={dateBeforeReRender} 
             setDateBeforeReRender={setDateBeforeReRender}
             setSelectedDateForEx={setSelectedDate}
              userId={userId}/>
              }
          </div>
        );
      }

export default WorkoutPage;