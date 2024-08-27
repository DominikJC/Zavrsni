import React, { useState, useEffect } from 'react';
import { ref, onValue, get,set,child,push } from 'firebase/database';
import { database } from './firebase';
import "./CEBuilder.css";
const CustomExerciseBuilder = ({userId,setJeliCustom}) =>
    {

        const [newEx,setNewEx]=useState({
            name:"",
            description:"",
            muscleGroup:"",
            equipment:""
        });

        const Create = () =>
            {
            
                const customExRef = ref(database,`exercises/custom/${userId}`);
                const customEx = ref(database,`exercises/custom`);
            
                if(Object.values(newEx).every((elem)=>elem!=""))
                    {
                get(customExRef).then((snapshot)=>
                    {
                        if(snapshot.exists())
                            {
                                console.log((Object.keys(snapshot.val())).length);
                                let br = (Object.keys(snapshot.val())).length;
                                const newData=snapshot.val()["cs"+br]=newEx;
                                set(child(customExRef,"cs"+br),newEx);
                            }
                        else
                        {
                            const newData = 
                            {cs0:newEx};
                            
                            set(child(customEx,userId),newData);
                        }
                    }
                ).catch((error)=>console.error(error));
                    
                        
                //console.log(Object.values(newEx));
                
                        setJeliCustom(false);
                    }
                    else
                    {
                        console.log("Nemoze");
                    }
               
               console.log("ovo je newEx"+Object.values(newEx))
            }
            const handleBack = () =>
                {
                    setJeliCustom(false);
                }
        const onChange=(value,field)=>
            {
                newEx[field]=value;
                setNewEx({...newEx})
                    console.log(newEx);
            }

        return(  <div>
            <button className='back-button' onClick={handleBack}>Back</button>
            <h3>Name:</h3>
            <div className='name'>
                <input className='inputt' type='text' onChange={(e) => onChange(e.target.value,"name")}/>
            </div>
            <h3>Muscle Group:</h3>
            <div className='muscleGroup'>
                <input className='inputt' type='text' onChange={(e) => onChange(e.target.value,"muscleGroup")}/>
            </div>
            <h3>Equipment:</h3>
            <div className='equipment'>
                <input className='inputt' type='text' onChange={(e) => onChange(e.target.value,"equipment")}/>
            </div>
            <h3>Description:</h3>
            <div className='description'>
                <textarea  className='descriptionn'
                        onChange={(e) => onChange(e.target.value,"description")} rows="4" cols="50"></textarea>
            </div>
           
                <button className='createButton' onClick={Create}>
                    Create Exercise
                </button>
            

        </div>);
    };

export default CustomExerciseBuilder;