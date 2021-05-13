import "./Login.css";

import React, { createContext, useContext, useState } from "react";
import {
    useHistory,
    useLocation
} from "react-router-dom";

const DATABASE = [
    { username: "adam", password: "hasło123" },
    { username: "ewa", password: "123" }
];

const authContext = createContext();

const useAuth = () => {
    return useContext(authContext);
  }

const LoginPage = () => {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();
  
    const [user, setUser] = useState();
    const [password, setPassword] = useState();
  
    let { from } = location.state || { from: { pathname: "/" } };
    let login = () => {
      auth.signin(() => {
        history.replace(from);
      });
    };
  
    const handleLogin = (e) => {
      e.preventDefault();
      
      let foundUser = DATABASE.filter(u => {
          if(u.username === user && u.password === password) return u;
          else {return null} 
      });
      
      return foundUser.length !== 0 ? 
          login() : 
          null;
    };
  
    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <form onSubmit={handleLogin}>
            <input 
              type="text" 
              onChange={(e)=>setUser(e.target.value)}
            />
            <input 
              type="password" 
              onChange={(e)=>setPassword(e.target.value)}
            />
            <button type="submit">Log in</button>
        </form>
      </div>
    );
  }

  export default LoginPage;