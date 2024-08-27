import React, { useState, useEffect } from 'react';
import "./CalendarWeek.css";
import { ref, onValue, get,set,child,runTransaction,remove } from 'firebase/database';
import { database } from './firebase';
import "./DayView.css";


function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here 
  // is better than directly setting `setValue(value + 1)`
}


const DayView = ({selectedDate,userId,setZaKalendar,setAreOnDay,isReset,setIsReset,setWorkoutCompletedIn,workoutCompletedIn,setView}) => {
  
  const [imaLiDana,setDanUworkout] = useState(true);
  const [selExercises,setSelExercises]=useState([]);
  const [exercisesToShow,setExercisesToShow]=useState([]);
  const [checked,setChecked] = useState(false);
  const [workoutCompleted,setWorkoutCompleted] = useState(false);
  const [isTempList,setIsTempList] = useState(false);
  const [days,setDays]=useState([ 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [exo,setExo]=useState(false);

  const handleTemplate = () =>
    {
      setIsTempList(true);
    }

  const FormatDate = () =>
    { 
     let month = '' + (selectedDate.getMonth() + 1),
      day = '' + selectedDate.getDate(),
      year = selectedDate.getFullYear();

      if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year,month,day].join("-");
    }
    
    const handleClick = () =>
      {
        setZaKalendar(true);
      }
//Everytime the dayViewRerender check if completed is true
useEffect(()=>
  {
    
    get(dayRefCompleted).then((snapshot)=>
      {
        console.log(snapshot.val());
        if(snapshot.val()==true)
          {
            setWorkoutCompleted(true);
            setWorkoutCompletedIn(true);
          }else{setWorkoutCompleted(false);
            setWorkoutCompletedIn(false);
          }

        setAreOnDay(true);

      }).catch(()=>{});
      
  },[DayView]);

    const dayRef = ref(database,`workouts/${userId}/${FormatDate()}`);
    const dayRefCompleted = ref(database,`workouts/${userId}/${FormatDate()}/completed`);
    const dayRefEx=ref(database,`workouts/${userId}/${FormatDate()}/exercises`);
    
    useEffect(()=>{
      if(isReset)
        {
          doSmthn();
          setIsReset(false);
          
         setView("");
        }
    },[isReset])



    get(dayRef).then((snapshot)=>
      {
        if(snapshot.exists())
          {
            setDanUworkout(true)
          }else
          {
            setDanUworkout(false);
          }
      }).catch((error)=>
        {
          console.error(error);
        }

      );

   ///////////////////////////////////////////////////////////////   
      useEffect(()=>{
      onValue(dayRefEx,(snapshot)=>
          {
            if(snapshot.exists())
              {
                setExercisesToShow(snapshot.val());
                //set(dayRefCompleted,false);
              }else
              {
                
              }
          });
       
      },[,workoutCompletedIn/*,exo*/]);
     
      
    /*  get(dayRefEx).then((snapshot)=>
        {
          if(snapshot.exists())
            {
              setExercisesToShow(snapshot.val());
            }else
            {
              
            }
        }).catch((error)=>
          {
            console.error(error);
          }
  
        );*/

///////////////////////////////////////////////////////////////////
      const  handleInputChange = (ind,field,value) =>
          {
            const dayRefExCurrent=ref(database,`workouts/${userId}/${FormatDate()}/exercises/${ind}`);
            get(dayRefExCurrent).then((snapshot)=>
              {

                set(child(dayRefExCurrent,field),value);

              }).catch((error)=>
              {
                console.error(error);
              });
          }


          const handleX=()=>
            {
               
                
                const userExRef = ref(database,`workouts/${userId}/${FormatDate()}`);        
                remove(userExRef);
                setView("week");

            }

          //postavlja kliknute vjezbe/exercises na done i onda proverava ako su sve done stavlja workout na completed
          let randArr = [];
          const toggleCompleted=(ind)=>
            {
              let truOrFalse=null;
              const dayRefExCurrentDone=ref(database,`workouts/${userId}/${FormatDate()}/exercises/${ind}/done`);
              get(dayRefExCurrentDone).then((snapshot)=>
                {
                  if(snapshot.val()==true)
                    {
                      set(dayRefExCurrentDone,false);
                      //setChecked(false);
                      truOrFalse=false;
                    }
                    else
                    {
                      set(dayRefExCurrentDone,true);
                      truOrFalse=true;
                      //setChecked(true);
                    }
                  
  
                }).catch((error)=>
                {
                  console.error(error);
                });
                
               

                get(dayRefEx).then(
                  (snapshot)=>
                    {
                      let exArr = Object.values(snapshot.val());
                      let numOfDones=0;
                      exArr.find((ex)=>
                        {
                          
                            if(numOfDones<0)
                              {
                                numOfDones=0;
                              }
                          if(ex.done==true)
                            {
                              numOfDones++;
                            }
                        });
                     
                     
                      if(numOfDones+1==exArr.length)
                        {
                          updateUserStats(userId,"");
                          set(dayRefCompleted,true);
                          setWorkoutCompleted(true);
                          setWorkoutCompletedIn(true);
                        }else
                        {
                          set(dayRefCompleted,false);
                          
                        }
                    }
                ).catch(error=>console.error(error));
            }



      /*      useEffect(()=>
              {
            if(exercisesToShow)
            {
              onValue(dayRefEx,(snapshot)=>
                {
                  set(dayRefCompleted,false);
                })
            }
                //console.log("Promijena");
              },[exercisesToShow]);
*/

const updateUserStats = async (userId, workoutData) => {
  const userStatsRef = ref(database, `stats/users/${userId}`);
  const userStatsSnapshot = await get(userStatsRef);
  const currentStats = userStatsSnapshot.val() || {};

  const updatedStats = {
    workoutsCompleted: (currentStats.workoutsCompleted || 0) + 1,
    
    // ... update other stats
  }

  await set(userStatsRef, updatedStats);

  // Update global stats
  const globalStatsRef = ref(database, 'stats/global');
  await runTransaction(globalStatsRef, (currentGlobalStats) => {
    if (currentGlobalStats === null) {
      return { totalWorkoutsCompleted: 1 };
    }else{
      
          return {
            ...currentGlobalStats,
            totalWorkoutsCompleted: (currentGlobalStats.totalWorkoutsCompleted || 0) + 1
          };
        
       
    
  }
  });
};
const downgradeUserStats = async () =>
  {
    const userStatsRef = ref(database, `stats/users/${userId}`);
  
    const userStatsSnapshot = await get(userStatsRef);
    const currentStats = userStatsSnapshot.val() || {};
    const updatedStats = { workoutsCompleted: (currentStats.workoutsCompleted || 0) - 1,};
    await set(userStatsRef, updatedStats);
    const globalStatsRef = ref(database, 'stats/global');

    await runTransaction(globalStatsRef, (currentGlobalStats) => {
      if (currentGlobalStats === null) {
        return { totalWorkoutsCompleted: 1 };
      }else{
        
            return {
              ...currentGlobalStats,
              totalWorkoutsCompleted: (currentGlobalStats.totalWorkoutsCompleted || 0) - 1
            };
        
  }})
  

}
const doSmthn = async ()=>
  {
    await runTransaction(dayRefEx,(dones)=>
      {
        //return {dones:1};
        const updatedDones = dones.map((obj) => {
          return { ...obj, done: false };
        });
        set(dayRefCompleted,false);
         return updatedDones;
      })
    downgradeUserStats();
    setTimeout(Postavi,100);
  }

const Postavi = () =>
  {
    setView("day")
  }

        const items = exercisesToShow.map((exercise,ind)=>
            
                  <div className="exercise-item">
              {!workoutCompleted?<div 
                className={!exercise.done?"checkbox":"checked"}
            onClick={()=>toggleCompleted(ind)}
              ></div>:<div className='checked'></div>}

              <div className="exercise-name">{exercise.name}</div>
              <div className="equipment">{exercise.equipment}</div>

              {!workoutCompleted?
              <InputGroup 
                value={exercise.sets || 0} 
                onChange={(value) => handleInputChange(ind,'sets', value)} 
              />:
              <input readOnly className="input-valuee" value={exercise.sets}/>}

              {!workoutCompleted?
              <InputGroup 
                value={exercise.reps || 0} 
                onChange={(value) => handleInputChange(ind,'reps', value)} 
              />:
              <input readOnly className="input-valuee" value={exercise.reps}/>}

            {  !workoutCompleted?
            <InputGroup 
                value={exercise.weight || 0} 
              onChange={(value) => handleInputChange(ind,'weight', value)} 
              />:
              <input readOnly className="input-valuee" value={exercise.weight}/>}
            </div>
                /*  <li key={ind} className="ex-za-dan">
                      <button className={ "checker-za-dann"} ></button>
                    <div className="vjezba-za-dan">{exercise.name}</div>
                    <div className="eq-za-dan">{exercise.equipment}</div>
                    <div className="sets-za-dan"><input className="setss-za-dan" type='number'/></div>
                    <div className="reps-za-dan"><input className="setss-za-dan" type="number"/></div>
                    <div className="weight-za-dan"><input className="setss-za-dan" type="number"/>kg</div>
                    
                  </li>
                  */
                  
            );

    if (!selectedDate) return null;


    return (
      <>
    {isTempList &&  <WorkoutTemplateList dayRef={dayRef} dayRefEx={dayRefEx} userId={userId} setIsTempList={setIsTempList} date={FormatDate()}/>}
      {!isTempList &&
      <div className="day-view">
     
      <div className="header">
        <div className="date">{days[selectedDate.getDay()]}</div>
       
      </div>
      
      <div className="columns">
        <div className="column exercise-col">Exercise</div>
        <div className="column equipment-col">Equipment</div>
        <div className="column">Sets</div>
        <div className="column">Reps</div>
        <div className="column">Weight</div>
      </div>
        <h2>{/*selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })*/}</h2>
        <div className='workouts'>{FormatDate()}</div>
        <div className='vjezbe'>
        {items}
        </div>
        <div className='button-cont'>
        <button onClick={handleClick} className="add-button">
              Add
            </button>
          <button className="add-button" onClick={handleTemplate}>Add Workout Template</button>
          {!workoutCompleted&&<button className='clear-button' onClick={handleX}>Clear</button>}
          </div>
           
            
      </div>}
      </>
    );
  };




  function InputGroup({ value, onChange }) {
    return (
      <div className="input-group">
        <button className="input-button" onClick={() => onChange(value - 1)}>-</button>
        <input 
          type="text" 
          className="input-value" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="input-button" onClick={() => onChange(value + 1)}>+</button>
      </div>
    );
  }

  const WorkoutTemplateList = ({userId,dayRefEx,date,setIsTempList,dayRef}) =>
    {
      const [hasTemplates,setHasTemplates]=useState(false);
      const [lista,setLista]=useState([]);
      const [drugaLista,setDrugaLista]=useState([]);
      const [selectedTemps,setSelectedTemps] = useState([]);
      const userTemplateRef = ref(database,`workoutTemplates/users/${userId}`);
      const items = lista.map((elem,ind)=>(
        <div>
          <p className={`row ${selectedTemps.includes(elem) ? 'selected' : ''}`} onClick={()=>handleSelectaj(elem)}>{elem}</p>
        </div>
      ))
      get(userTemplateRef).then((snapshot)=>
        {
          if(snapshot.exists())
            {
              const lista = Object.keys(snapshot.val());
              const drugaLista = Object.entries(snapshot.val());
              setLista(lista);
              setDrugaLista(drugaLista);
              setHasTemplates(true)
            }else
            {

            }
        }).catch(()=>{});


        
    const  handleAddTemplate = () =>
        {
          get(dayRefEx).then(
            (snapshot)=>
              {
  
               
              const newActualTemplates = drugaLista.filter(template=>
                          
                  selectedTemps.includes(template[0])
                  
              );
              const exKakoTemp = newActualTemplates[0][1].map(ex=>
                ({
                  equipment:ex.equipment,
                  name:ex.name,
                  done:false,
                  id:ex.id,
                  reps:ex.reps || 0,
                  sets:ex.set || 0,
                  weight:ex.weight || 0
                }));

              console.log("IDe EX KAKO TEMP: "+newActualTemplates[0][1][1].equipment);
              console.log(newActualTemplates)
                if(snapshot.exists())
                  {
                 set(dayRefEx,exKakoTemp);
                  }else
                  {
                  
                   
                  }
              }
          ).catch();
          

          get(dayRef).then(
            (snapshot)=>
              {
  
               
              const newActualTemplates = drugaLista.filter(template=>
                          
                  selectedTemps.includes(template[0])
                  
              );
            
              const exKakoTemp = newActualTemplates[0][1].map(ex=>
                ({
                  equipment:ex.equipment,
                  name:ex.name,
                  done:false,
                  id:ex.id,
                  reps:ex.reps || 0,
                  sets:ex.set || 0,
                  weight:ex.weight || 0
                }));

                if(snapshot.exists())
                  {
                
                  }else
                  {
                    setIsTempList(false);
                    console.log(newActualTemplates);
                    const newData = {
                      completed:false,exercises:exKakoTemp};
                   set(dayRef,newData);
                   
                  }
              }
          ).catch();
          
        }


        

        const handleSelectaj = (id) =>
          {
            /*setSelectedTemps(oldArray => {
              if (oldArray.includes(id)) {
                return oldArray.filter(sid => sid !== id);  //deselekta ex
              } else {
                return [...oldArray, id];  //selekta ex
              }})*/
             setSelectedTemps(id);
              console.log(selectedTemps)
          }
        const handleDebug = ()=>
          {
            console.log(lista);
          }
      return(<>
      {!hasTemplates && <h2>You have no templates,contact a trainer</h2>}
      
      {items}
      <button className='add-button' onClick={handleAddTemplate}>Add template</button>
      </>);
    }


  export default DayView;
  /*   <div className="day-schedule">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="time-slot">
              <span className="time">{i.toString().padStart(2, '0')}:00</span>
              <div className="event-space"></div>
            </div>
          ))}
        </div>*/ 