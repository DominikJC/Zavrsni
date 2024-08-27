import React, { useState, useEffect } from 'react';
import { ref, push, set, get, onValue, child,remove } from 'firebase/database';
import { database } from './firebase';
import "./WorkoutTemplateManager.css";
import {ExercisesTemplateList} from './Exercises';
import CustomExerciseBuilder from './CustomExerciseBuilder';


const WorkoutTemplateCreator = ({userId,setNewTemplate,setJeliCustom})=>
    {
      const [showExercises,setShowExercises]=useState(false);
      const [exercisesToShow,setExercisesToShow]=useState([]);  
      const [actualExercisesToShow,setActualExercisesToShow] = useState([]);
      const[exercises,setExercises]=useState([]);
      const [templateName,setTemplateName]=useState("NoName");
      
    
        const handleClick = ()=>
            {
                setShowExercises(true);
                
            }


    const handleCreate = () =>
        {
            const trainerRef = ref(database,`workoutTemplates/trainers/${userId}`);
            set(child(trainerRef,templateName),actualExercisesToShow);
            setNewTemplate(false);
        } 
            
    const handleName = (e)=>
        {
            setTemplateName(e);
            console.log(templateName);
        }
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
          
                    console.log("ovo je arr"+customExercisesArray)
                      setExercises(bothArr);
                      
                  
                  }catch(error)
                  {
                      console.error("Error fetching exercises:",error);
                  }
              };
              fetchExercises();
                      
              },[]);

              useEffect(()=>
                {
                    console.log("ovo su exercisesTOShow"+exercisesToShow)
                    console.log("ovo ti je tip "+typeof exercisesToShow[2]);
                    console.log("ovo su exercises"+exercises)
                   const newAcutalExercises = exercises.filter(exercise=>
                        
                            exercisesToShow.includes(exercise.id)
                            
                        );
                  
                            setActualExercisesToShow(prevArray=>{return [...prevArray,...newAcutalExercises]})
                            console.log("Ovo su aktuali"+actualExercisesToShow)
                            
                        //console.log("od efenkaa"+newAcutalExercises);
                       
                },[exercises,exercisesToShow]);

           /*const mItems = exercisesToShow.map((id,ind)=>
                {
                    //for loop to check if the id matches in exercises to show matches any of the exercises id in exercises than add the object to actual exercises to show then show them
                    for(let i = 0;i<exercises.length;i++)
                        {
                            if(id==exercises[i].id)
                                {
                                    setActualExercisesToShow(prevArray=>{return [...prevArray,exercises[i]]})
                                }
                        }
                });*/

        const onChange = (value,index,field)=>
            {
                            setActualExercisesToShow(prevExercises => 
                                prevExercises.map((exercise, i) => 
                                  i === index ? { ...exercise, [field]: value } : exercise
                                )
                              );
                    console.log("najnoviji"+Object.values(actualExercisesToShow[0]));
            }

          const items = actualExercisesToShow.map((exercise,ind)=>

        <div className="exercise-item" key={ind}>
            
      
            <div className="exercise-name">{exercise.name}</div>
            <div className="equipment">{exercise.equipment}</div>
            <InputGroup onChange={onChange} value={exercise.reps || 0} field={"reps"} index={ind}/>
            <InputGroup onChange={onChange} value={exercise.sets || 0} field={"sets"} index={ind}/>
            <InputGroup onChange={onChange} value={exercise.weight || 0} field={"weight"} index={ind}/>
            
        </div>

      );

        return (<>
            {showExercises&&<ExercisesTemplateList setJeliCustom={setJeliCustom} userId={userId} setShowExercises={setShowExercises} setExercisesToShow={setExercisesToShow}/>}
           {!showExercises && <div className="day-view">
           
            <div className="header">
              <input className='template-name' value={templateName} onChange={(e)=>handleName(e.target.value)}></input>
            </div>
            
            <div className="columns">
              <div className="column exercise-col">Exercise</div>
              <div className="column equipment-col">Equipment</div>
              <div className="column">Sets</div>
              <div className="column">Reps</div>
              <div className="column">Weight</div>
            </div>
              <h2>{/*selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })*/}</h2>
              
              <div className='vjezbe'>
              {items}
              </div>
              <button onClick={handleClick} className="add-button">
                    Add
                  </button>
              <button onClick={handleCreate} className="add-button">
                    Create new  template
              </button>
                  
                  
                  
            </div>}</>
          );
        };
      
      
      //once the value is changed we find the object with the same index as the valuue and add a property to that object
      
        function InputGroup({ value, onChange,index,field }) {
          return (
            <div className="input-group">
              <button className="input-button" onClick={() => onChange(Number(value - 1),index,field)}>-</button>
              <input 
                type="text" 
                className="input-value" 
                value={value} 
                onChange={(e) => onChange(e.target.value,index,field)}
              />
              <button className="input-button" onClick={() => onChange(Number(value + 1),index,field)}>+</button>
            </div>
          );
        }
    


const WorkoutTemplateManager = ({userId})=>
{

  const [newTemplate, setNewTemplate] = useState(false);
  
  const [currentUsers, setCurrentUsers] = useState([
    { name: 'User 1', id: 'user1' },
    { name: 'User 2', id: 'user2' },
    { name: 'User 3', id: 'user3' },
  ]);
  const [selectedUsers,setSelectedUsers] = useState([]);
  const [templates,setTemplates]=useState([]);
  const [selectedTemplates,setSelectedTemplates]=useState([]);
  const [templateValues,setTemplateValues]=useState([]);
  const[isAddingUsers,setIsAddingUsers]=useState();
  const [userUnderT,setUserUnderT]=useState();
  const[exo,setExo]=useState(false);
  const [jeliCustom,setJeliCustom] = useState(false);
  const[isEvent,setIsEvent]=useState(false);
  useEffect(()=>
    {
        
    },[isAddingUsers]);
  useEffect(()=>
    {
       /* get(ref(database,`trainerUserRel/trainers/${userId}/users`)).then((snapshot)=>
            {
                const usersUnder = Object.values(snapshot.val())
                setUserUnderT(usersUnder);
                console.log("ovo su odabrani useri"+userUnderT)
            }).catch();*/

        const fetchUsers = async () => {
            const usersRef = ref(database, 'users');
            const userTrainerRelRef = ref(database,`trainerUserRel/trainers/${userId}`);
            
            try{
            const usersSnapshot = await get(usersRef);
            const usersObjects =  usersSnapshot.val() || {};
            const usersTrSnapshot = await get(userTrainerRelRef);
            const userTrObjects = usersTrSnapshot.val()||{};
            const usersIds = Object.values(userTrObjects)
            const usersKeys = Object.entries(usersObjects).filter(user=>usersIds.includes(user[0]));
            console.log("ovo su kurenit"+currentUsers);
            setCurrentUsers(usersKeys);

//Pitat za objašnjenejeee
           
        }catch(error)
        {
            console.error("Error fetching exercises:",error);
        }
    };
    fetchUsers();
            
    },[,isAddingUsers]);



    useEffect(()=>
        {
            const fetchExercises = async () => {
                const templateRef = ref(database, `workoutTemplates/trainers/${userId}`);
                
                
                try{
                const templatesSnapshot = await get(templateRef);
                const templateObjects =  templatesSnapshot.val() || {};
                const templateKeys = Object.keys(templateObjects);
                const templateValuess = Object.entries(templateObjects);
                setTemplates(templateKeys);
                setTemplateValues(templateValuess);
                console.log("ovo su temp"+templates);
    
    //Pitat za objašnjenejeee
               
            }catch(error)
            {
                console.error("Error fetching exercises:",error);
            }
        };
        fetchExercises();
                
        },[,isAddingUsers,newTemplate,exo]);


  const handleCreateTemplate = () => {
    // Implement logic to create a new workout template
    setNewTemplate(true);
    console.log('Creating new workout template:', newTemplate);
  };

  const handleAddUser = () => {
    // Implement logic to add a new user
    setIsAddingUsers(true);
    console.log('Adding new user');
    console.log("ovo su underr tttt"+currentUsers)
  };

  const handleSelectUser = (id) =>
    {   
        setSelectedUsers(oldArray => {
            if (oldArray.includes(id)) {
              return oldArray.filter(sid => sid !== id);  //deselekta ex
            } else {
              return [...oldArray, id];  //selekta ex
            }})
        console.log(selectedUsers);
    }

    
const handleSelectTemp = (id) =>
    {
        setSelectedTemplates(oldArray => {
            if (oldArray.includes(id)) {
              return oldArray.filter(sid => sid !== id);  //deselekta ex
            } else {
              return [...oldArray, id];  //selekta ex
            }})
           // console.log(templateValues[1][1][2].name)
            console.log("ovo je ime"+templateValues[0][0])
            console.log("ovo je selected"+selectedTemplates)
    }

const handleSend = () =>
    {
        
        selectedUsers.map((userId)=>
            {
                
                const userTemplateRef = ref(database,`workoutTemplates/users/${userId}`);
                get(userTemplateRef).then((snapshot)=>
                    {
                        
                          
                                const newActualTemplates = templateValues.filter(template=>
                        
                                    selectedTemplates.includes(template[0])
                                    
                                );
                           
                        console.log(newActualTemplates);
                        
                        newActualTemplates.map((arr,ind)=>
                            {
                                set(child(userTemplateRef,arr[0]),arr[1]);
                            })
                             
        setIsEvent(true);
        setTimeout(zaEvent,2000);
                    }).catch();

        
            })
       
    }

   const zaEvent = () =>
    {
      setIsEvent(false);
      
    }

    const handleX=()=>
        {
           
            selectedTemplates.map(temp=>
                {
                    const userTemplateRef = ref(database,`workoutTemplates/users/${userId}/${temp}`);
                    const trainerTemplateRef = ref(database,`workoutTemplates/trainers/${userId}/${temp}`);
                    console.log(temp)
                    remove(userTemplateRef);
                    remove(trainerTemplateRef);
                })
            console.log(selectedTemplates);
            setExo(true);
        }

  return (
    <>
   {newTemplate && !jeliCustom && <WorkoutTemplateCreator setJeliCustom={setJeliCustom} jeliCustom={jeliCustom} setNewTemplate={setNewTemplate} userId={userId}/>}
   {jeliCustom && <CustomExerciseBuilder setJeliCustom={setJeliCustom} userId={userId}/>}
  {!newTemplate && !isAddingUsers && <div className="container">
      <div className="left-panel">
        <div className="create-workout-template">
         
          <button className='left-panel-button' onClick={handleCreateTemplate}>-Create Workout Template-</button>
        </div>
        <div className="choose-template">
      
          <h3>Choose template</h3>
         
            {templates.map((temp,ind)=>
                
                    <div className={`roww ${selectedTemplates.includes(temp) ? 'selected' : ''}`} onClick={()=>handleSelectTemp(temp)}>{temp}</div>
                    
                )}
        
          <div className="buttons">
            <button className="send-template right-panel-button" onClick={handleSend}>Send Template</button>
            <button className="x-button right-panel-button" onClick={handleX}>Delete</button>
          </div>
          {isEvent&&<div className='poruka'>Template/s sent succesfullly</div>}
        </div>
      </div>
      
      <div className="right-panel">
        <div className="current-users">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user,ind) => (
                <tr className={`roww ${selectedUsers.includes(user[0]) ? 'selected' : ''}`} onClick={()=>handleSelectUser(user[0])} key={ind}>
                  <td>{user[1]?user[1].name:"noNAme"}</td>
                  <td>{user[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className='left-panel-button' onClick={handleAddUser}>Add new Users</button>
        </div>
      </div>
    </div>}
    {isAddingUsers && <UserAdder userId={userId} setIsAddingUsers={setIsAddingUsers}/>}
    </>
  );
}



const UserAdder = ({userId,setIsAddingUsers}) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [selUsers,setSelUsers]=useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = ref(database, 'users');
            try {
                const usersSnapshot = await get(usersRef);
                const usersObjects = usersSnapshot.val() || {};
                const usersArray = Object.entries(usersObjects);
                setUsers(usersArray);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (filter) {
            const filteredItems = users.filter(user=>user[1].name==filter
            );
               
            setFilteredUsers(filteredItems);
        } else {
            setFilteredUsers(users);
        }
    }, [filter, users]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };
    const handleSelect = (uId) =>
        {
            setSelUsers(oldArray => {
                if (oldArray.includes(uId)) {
                  return oldArray.filter(sid => sid !== uId);  //deselekta ex
                } else {
                  return [...oldArray, uId];  //selekta ex
                }})
                console.log(selUsers)
        }

    const renderUserItem = (user) => (
        <div onClick={()=>handleSelect(user[0])} key={user[0]} className={`thingToSelect ${selUsers.includes(user[0]) ? "selected":""}`}>
            <p>{user[1].name}</p>
            <p>{user[0]}</p>
        </div>
    );
    const AddUsers = () =>
        {
            const userTrainerRel = ref(database,`trainerUserRel/trainers/${userId}`);
            get(userTrainerRel).then((snapshot)=>
                {
                    const existingData=Object.values(snapshot.val());
                    console.log("existing data"+existingData)
                    const selectedUsers = selUsers.filter(uId=>!existingData.includes(uId));
                        
                    const newData = [...existingData,
                        ...selectedUsers];
                    
                    set(userTrainerRel,newData);
                }).catch();
            setIsAddingUsers(false)
        }
    return (
        <>
            <div className='headers'>
                <h1>Add a new user</h1> 
                <input
                    className='inputss'
                    type="text"
                    placeholder="enter user name"
                    onChange={handleFilterChange}
                    value={filter}
                />
            </div>
            <div className='headers'>
                <p>Name</p>
                <p>User ID</p>
            </div>
            <div className='things'>
                {filteredUsers.map(renderUserItem)}
            </div>
            <button className='left-panel-button' onClick={AddUsers}>Add USers</button>
        </>
    );
};


export default WorkoutTemplateManager;


