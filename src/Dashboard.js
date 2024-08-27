import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { auth,database } from './firebase';
import { ref, push, set, get, onValue } from 'firebase/database';
import "./Dashboard.css";



const AdminDashboard = ({userId}) => {
    const [globalStats, setGlobalStats] = useState(null);
    const [users,setUsers]=useState([]);
    const [whatRole,setWhatRole] = useState("user");
    const [whatUser,setWhatUser]=useState("");
    const [name,setName]=useState("");
  const[exercises,setExercises]=useState([]);
  const[customEx,setCustomEx]=useState([]);

    useEffect(() => {
      const globalStatsRef = ref(database, `stats/global`);
      get(globalStatsRef).then((snapshot) => {
        if(snapshot.exists())
          
          {
            setGlobalStats(Object.entries(snapshot.val()));
          }
       
      });
    }, []);

    useEffect(()=>
      {
        const userRef = ref(database,"users");
        get(userRef).then(
          (snapshot)=>
            {
              if(snapshot.exists())
                {
                  const userEntries = Object.entries(snapshot.val());
              setUsers(userEntries);
                }
            }
        ).catch();
        const globalExRef = ref(database,"exercises/global");
        get(globalExRef).then(
          (snapshot)=>
            {
              if(snapshot.exists())
                {
                  const exEntries = Object.entries(snapshot.val());
              setExercises(exEntries);
                }
            }
        ).catch();


        
        const customExRef = ref(database,"exercises/custom/"+whatUser);
        get(customExRef).then(
          (snapshot)=>
            {
              if(snapshot.exists())
                {
                  const customExEntries = Object.entries(snapshot.val());
              setCustomEx(customExEntries);
                }
            }
        ).catch();
      },[,whatUser])
  
      const items = users.map((user)=>(
        
        <option value={user[0]}>{user[0]}</option>
        
      ))
      const handleSelect=(value)=>
      {
        const userInf = users.find(elem=>elem[0]==value);
        const role = userInf[1].role;
        setName(userInf[1].name);
        console.log(role);
        setWhatRole(role);
        setWhatUser(value);
      }
      const handleChangeRole = (newRole) =>
        {
          const userRoleRef = ref(database,`users/${whatUser}/role`);
          set(userRoleRef,newRole);
        }
        const exItems = exercises.map((ex,ind)=>
        (
            <>
            <div>{ex[1].name} : {ex[1].usedCount||"0"}</div>
            <div></div>
            </>
        ))
        const customExItems = customEx.map((ex,ind)=>
          (
              <>
              <div>{ex[1].name} : {ex[1].usedCount}</div>
              <div></div>
              </>
          ))
    return (
      <div className='dashboard'>
        <h1>Admin Dashboard</h1>
        {globalStats ? (
          <div>Total Workouts Completed:<span style={{color:"#46ffbc",fontWeight:"bold"}}> {globalStats[1][1]}</span></div>
        ) : 
          <div>Loading...</div>
        }
        <h2>Change user Roles:</h2>
        <div className='changeRoles'>
          
          <div className='ids'>
              <select onChange={(e)=>handleSelect(e.target.value)} name='ids'>
                  {items||<div>Nothing</div>}
              </select>
          </div>
          
          <div className='name'>User name: <span style={{color:"#46ffbc",fontWeight:"bold"}}>{name}</span></div>
          <div className='roles'>
              <select onChange={(e)=>handleChangeRole(e.target.value)} name='roles'>
                  <option selected={whatRole=="user"?"selected":""} value="user">user</option>
                  <option selected={whatRole=="trainer"?"selected":""} value="trainer">trainer</option>
                  <option selected={whatRole=="admin"?"selected":""} value="admin">admin</option>
              </select>
          </div>
          
        </div>
        <h3>Amount of times a global exercise has been used:</h3>
        <div className='exercises'>
        {exItems}
        </div>
        <h3>Amount of times a custom exercise has been used:</h3>
        <div className='customExercises'>
        {customExItems}
        </div>
        
      </div>
    );
  };
  
  const Dashboard = ({userId}) => {
    const [userRole, setUserRole] = useState("user");
    const [stats, setStats] = useState(null);
  
    useEffect(() => {
      const userRoleRef = ref(database, `users/${userId}/role`);
      get(userRoleRef).then((snapshot) => {
        if(snapshot.exists())
          {
            const role = snapshot.val();
        setUserRole(role);
          }
        
      });
  
      const userStatsRef = ref(database, `stats/users/${userId}`);
      get(userStatsRef).then((snapshot) => {
        if(snapshot.exists())
          {
            setStats(Object.entries(snapshot.val()));

          }
      });
    }, [userId]);
  
    return (
      <div className='dashboard-page'>
        {userRole === "admin" && <AdminDashboard userId={userId} />}
        <div className='dashboard'>
          <h2>Your Stats</h2>
          <p>Workouts Completed: </p>
          {stats &&
            stats.map(([key, value]) => (
              <p key={key}>
             
                {value}
              </p>
            ))||<div>Nothing</div>}
        </div>
      </div>
    );
  };

  export default Dashboard;