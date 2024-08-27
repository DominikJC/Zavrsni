
import { auth,database } from './firebase';
import React,{useState,useEffect} from 'react';
import { ref, push, set, get, onValue, child } from 'firebase/database';
import "./Exercises.css";
import { unstable_useViewTransitionState } from 'react-router-dom';


function ExercisesList({setZaKalendar,dateBeforeReRender,userId,setJeliCustom})
{


  const FormatDate = () =>
    { 
     let month = '' + (dateBeforeReRender.getMonth() + 1),
      day = '' + dateBeforeReRender.getDate(),
      year = dateBeforeReRender.getFullYear();

      if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year,month,day].join("-");
    }
    

    const [selExercises,setSelExercises] = useState([]);
    const [exercises,setExercises]=useState([]);
    const [customExercises,setCustomExercises]=useState([]);                                                         //pitat za popravaka mozd


useEffect(()=>
    {
        const fetchExercises = async () => {
            const globalExercisesRef = ref(database, 'exercises/global');
            const customExercisesRef = ref(database, `exercises/custom/${userId}`);
            
            try{
            const globalSnapshot = await get(globalExercisesRef);
            const globalExercises =  globalSnapshot.val() || {};
            const customSnapshot = await get(customExercisesRef);
            const customExercises =  customSnapshot.val() || {};

//Pitat za objašnjenejeee
            const exercisesArray = Object.entries(globalExercises).map(([id,exercise])=>({
                id,
                ...exercise
            }));
            const customExercisesArray = Object.entries(customExercises).map(([id,exercise])=>(
              {
                id,...exercise
              }));

            let bothArr = customExercisesArray.concat(exercisesArray);
            setExercises(bothArr);
            setCustomExercises(customExercisesArray);
        
        }catch(error)
        {
            console.error("Error fetching exercises:",error);
        }
    };
    fetchExercises();
            
    },[]);



    const handleAdd = () => 
      {
        const workoutsRef=ref(database,"workouts/"+userId);
        const workoutsRefForDay=ref(database,"workouts/"+userId+"/"+FormatDate());
        const workoutsRefForDayEx=ref(database,"workouts/"+userId+"/"+FormatDate()+"/exercises");


        //sets new exercises to existing workout
        get(workoutsRefForDayEx).then((snapshot) => 
          {
            if(snapshot.exists())
              {
                const selectedExercisesData = exercises.filter(ex => selExercises.includes(ex.id));
                let existingData = [];
                existingData = snapshot.val();
                const newData=[...existingData, ...selectedExercisesData.map(exercise => ({
                  id: exercise.id,
                  equipment:exercise.equipment,
                  sets: 0,
                  reps:0,
                  weight:0.0,
                  name:exercise.name,
                  done:false
                 
                }))];
                
            set(workoutsRefForDayEx,newData);
              }
          }).catch((error) => {
            console.error("Error checking data:", error);
          });


          //Sets the workout for the day if it doesnt exist
        get(workoutsRefForDay).then((snapshot) => {
          if (snapshot.exists()) {
            // Data exists
            
        
           
            console.log("Data exists:", snapshot.val());
          } else {
            // Data doesn't exist
            console.log("No data available");
           
            const selectedExercisesData = exercises.filter(ex => selExercises.includes(ex.id));
            //if(workoutTemplate){selectedExercisesData=getWorkoutsFormWorkoutTemplate}
            set(workoutsRefForDay, {
              completed: false,
              exercises: selectedExercisesData.map(exercise => ({
                id: exercise.id,
                equipment:exercise.equipment,
                sets: exercise.sets || 0,
                reps:exercise.reps ||0,
                weight:exercise.weight || 0.0,
                name:exercise.name,
                done:false
                // Add any other initial exercise data here
              }))});
          }
          selExercises.map((id)=>
            {
              if(!id.includes("cs")){
              get(ref(database,`exercises/global/${id}/usedCount`)).then((snapshot)=>
                {
                  const existingData = snapshot.val();
                set(ref(database,`exercises/global/${id}/usedCount`),existingData+1);
                  
                })
           console.log("kkkkk");
              }else
              {
                get(ref(database,`exercises/custom/${userId}/${id}/usedCount`)).then((snapshot)=>
                  {
                    const existingData = snapshot.val();
                  set(ref(database,`exercises/custom/${userId}/${id}/usedCount`),existingData+1);
                    
                  })
              }
            })
        }).catch((error) => {
          console.error("Error checking data:", error);
        });

        
        setZaKalendar(false);
      }

      const handleCreate =()=>
        {
          setJeliCustom(true);
        }

    const handleExClick = (exId) =>
      {
        console.log("kliko");
        setSelExercises(oldArray => {
          if (oldArray.includes(exId)) {
            return oldArray.filter(id => id !== exId);  //deselekta ex
          } else {
            return [...oldArray, exId];  //selekta ex
          }
        });
          console.log(selExercises);
      }
      const [showDesc,setShowDesc]=useState(false);
      const handleDesc = () =>
              
        {
          setShowDesc(!showDesc);
        }
        console.log(exercises)
    return (
        
        <div className="container">
          <div className="tracker-box">
            <div className="header">
              <span>Name</span>
              <span>Equipment</span>
              <span>Desc.</span>
            </div>
            <div className='ex-container'>
            {exercises.map((exercise) => (
              <div onClick={(()=>handleExClick(exercise.id))}
                key={exercise.id}
                className={`row ${selExercises.includes(exercise.id) ? 'selected' : ''}`}
              >
               
                <span>{exercise.name}</span>
                <span>{exercise.equipment}</span>
                <span className='deskripcija' onClick={handleDesc}>{showDesc?exercise.description:"..."}</span>
              </div>
            ))}
            </div>
            <button onClick={handleAdd} className="add-button">
              Add
            </button>
            <button className="add-button" onClick={handleCreate}>
              Create custom exercise
            </button>
          </div>
        </div>
      );   
}

export const ExercisesTemplateList = ({setShowExercises,setExercisesToShow,setJeliCustom,userId}) =>
  {
    const[exercises,setExercises]=useState([]);
    const [selExercises,setSelExercises] = useState([]);
    const [showDesc,setShowDesc]=useState(false);
    useEffect(()=>
      {
          const fetchExercises = async () => {
              const globalExercisesRef = ref(database, 'exercises/global');
              const customExercisesRef = ref(database, `exercises/custom/${userId}`);
              
              try{
              const globalSnapshot = await get(globalExercisesRef);
              const globalExercises =  globalSnapshot.val() || {};
               //custom Exercises
               const customSnapshot = await get(customExercisesRef);
               const customExercises =  customSnapshot.val() || {};
  
  //Pitat za objašnjenejeee
              const exercisesArray = Object.entries(globalExercises).map(([id,exercise])=>({
                  id,
                  ...exercise
              }));
             
              const customExercisesArray = Object.entries(customExercises).map(([id,exercise])=>(
                {
                  id,...exercise
                }));
  
              let bothArr = customExercisesArray.concat(exercisesArray);
              setExercises(bothArr);
              
              
          
          }catch(error)
          {
              console.error("Error fetching exercises:",error);
          }
      };
      fetchExercises();
              
      },[]);

      const handleExClick = (exId) =>
        {
          console.log("kliko");
          setSelExercises(oldArray => {
            if (oldArray.includes(exId)) {
              return oldArray.filter(id => id !== exId);  //deselekta ex
            } else {
              return [...oldArray, exId];  //selekta ex
            }
          });
            console.log("Ovo su selektirani"+selExercises);
        }


        const handleAdd = () =>
          {
            setShowExercises(false);
            setExercisesToShow(selExercises);
            console.log("ovo je tip od selExercises: "+typeof selExercises[0])
          }
          const handleCreate =()=>
            {
              setJeliCustom(true);
            }
            const handleDesc = () =>
              
              {
                setShowDesc(!showDesc);
              }
    return (
     
     <div className="container">
        <div className="tracker-box">
          <div className="header">
            <span>Name</span>
            <span>Equipment</span>
            <span>Desc.</span>
          </div>
          <div className='ex-container'>
          {exercises.map((exercise) => (
            <div onClick={(()=>handleExClick(exercise.id))}
              key={exercise.id}
              className={`row ${selExercises.includes(exercise.id) ? 'selected' : ''}`}
            >
              
              <span>{exercise.name}</span>
              <span>{exercise.equipment}</span>
              <span className='deskripcija' onClick={handleDesc}>{showDesc?exercise.description:"..."}</span>
            </div>
          ))}
          </div>
          <button onClick={handleAdd} className="add-button">
            Add
          </button>
          <button onClick={handleCreate} className="add-button">
            Create custom exercise
          </button>
        </div>
      </div>
    );  
  }

export default ExercisesList;