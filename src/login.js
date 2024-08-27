import React, {useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from './firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import "./login.css";


export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [jeli,setJeli] = useState(false);   

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/")
            console.log(user.email);
        })
        .catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage,"neideeeeee")
            setJeli(true);
        });
       
    }
 
    return(
        <>
            <main className='forma'>        
                <section>
                    <div>                                            
                                              
                        <form>   
                                                                  
                            <div style={{padding:"20px"}}>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <br/>
                                <input 
                                    className='inputs'
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required                                                                                
                                    placeholder="Email address"
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>

                            <div style={{padding:"20px"}}>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <br/>
                                <input
                                className='inputs'
                                    id="password"
                                    name="password"
                                    type="password"                                    
                                    required                                                                                
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                           {jeli && <div style={{color:"red"}}>Please enter valid information</div>  }              
                            <div style={{padding:"20px"}} >
                                <button  className='but' onClick={onLogin} >      
                                    Login                                                                  
                                </button>
                            </div>                               
                        </form>
                       
                        <p className="text-sm text-white text-center">
                            No account yet? {' '}
                            <NavLink to="/signup">
                                Sign up
                            </NavLink>
                        </p>
                                                   
                    </div>
                </section>
            </main>
        </>
    )
}