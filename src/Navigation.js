import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './Navigation.css';
import logo from './as.png';
import { ref, push, set, get, child} from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import {database } from './firebase';

import { TiCalendarOutline,TiThLargeOutline } from "react-icons/ti";
import { IoStatsChartSharp } from "react-icons/io5";

function NavBar({userId,handleLogin,handleLogout,name})
{
  const [aktivan,setAktivan]=useState("/");
  const [isUser,setIsUser]=useState(true);
  const [isGuest,setIsGuest]=useState(false);
   const navigate = useNavigate();
   const handleClick = (di)=>
    {
      navigate(di)
      setAktivan(di);
    }
  useEffect(()=>
    {
      
      const userRoleRef = ref(database,`users/${userId}/role`);
      get(userRoleRef).then((snapshot)=>
        {
          console.log("nijeUSERR")
          if(snapshot.val()=="admin" || snapshot.val()=="trainer")
            {
              setIsUser(false);
              console.log("nijeUSER")
            }
            else{setIsUser(true)}
        }).catch()
      
    },[,aktivan,userId])
  const handleTempManager = (di) =>
    {
      navigate(di);
      setAktivan(di);
      const trainerUserRef = ref(database,`trainerUserRel/trainers/${userId}`);
      const trainerUserRelRef = ref(database,`trainerUserRel/trainers`);
      get(trainerUserRef).then(
        (snapshot)=>
        {
          if(snapshot.exists())
            {

            }else
            
            {
              set(child(trainerUserRelRef,userId),1);
            }
        }
      ).catch();
    }
    return(<>
    <nav class="top-nav">

  <div class="logo">
  <img src = {logo} alt="My Happy SVG" height="44px"/>
  <div className='left-corner'>
    <p>Pozdrav</p>
    <h2>Dobrodošli...</h2>
    </div>
  </div>
  
  <div class="user-info">
    <span class="user-name">{userId==""?"Guest":name}</span>
 
    {userId==""?<button className='nav-itemm' onClick={handleLogin}>Login</button>:<button onClick={handleLogout} className='nav-itemm'>Logout</button>}
  </div>
</nav>

<nav class="left-nav">
  <div class={aktivan=="/"?"nav-item active":"nav-item"} onClick={()=>handleClick("/")}><i class="icon-calendar">< TiCalendarOutline  className={aktivan=="/"?"aktivna-ikona":""}/></i></div>
  {!userId=="" &&<div class={aktivan=="/dashboard"?"nav-item active":"nav-item"} onClick={()=>handleClick("/dashboard")}><i class="icon-week"><IoStatsChartSharp className={aktivan=="/dashboard"?"aktivna-ikona":""}/></i></div>}
  {!userId == "" && !isUser && <div class={aktivan=="/template-manager"?"nav-item active":"nav-item"} onClick={()=>handleTempManager("/template-manager")}><i class="icon-week"><TiThLargeOutline className={aktivan=="/template-manager"?"aktivna-ikona":""}/></i></div>}
  
</nav>
    </>);
}
export default NavBar;