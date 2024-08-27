import logo from './logo.svg';
import './App.css';
import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import  {Routes,Route} from 'react-router-dom';
import {Login} from "./login";
import {Signup} from "./signup";
import { onAuthStateChanged } from "firebase/auth";
import { auth,database } from './firebase';
import { ref, push, set, get, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import NavBar from './Navigation';
import WorkoutPage from './WorkoutPage';
import Dashboard from './Dashboard';
import WorkoutTemplateManager from './WorkoutTemplateManager';

function App() {
  const navigate = useNavigate();
  const [userId,setUserId] = useState("");
  const [name,setName]=useState("");



  const nameRef = ref(database,"users/"+userId+"/name");
  get(nameRef).then((snapshot) => {
    if (snapshot.exists()) {
      setName(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });


  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
         
          const uid = user.uid;
         setUserId(uid);
          //setUserW(user.email
          //);
          console.log("uid", user.email)
        } else {
        
         setUserId("");
          console.log("user is logged out")
        }
      });
     
}, []);


  const handleLogin=()=>
    {
      navigate("/login");
    }
  
  const handleLogout = () => {               
    signOut(auth).then(() => {
  
        navigate("/");
        console.log("Signed out successfully")
    }).catch((error) => {
  
    });
  }

  return (
    <div className="App">
      
     <NavBar name={name} userId={userId} handleLogin={handleLogin} handleLogout={handleLogout}/>
     <Routes>
        <Route path='/' element={< WorkoutPage userId={userId}/>}/>
        <Route path='/dashboard' element={<Dashboard userId={userId}/>}/>
        <Route path="/template-manager"
          element={<WorkoutTemplateManager userId={userId} />}/> 
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        
    </Routes>
    </div>
  );
}

export default App;
