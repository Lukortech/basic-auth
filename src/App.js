import {
  Link,
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import React, { createContext, useContext, useState } from "react";

const DATABASE = [
    { username: "adam", password: "hasło123" },
    { username: "ewa", password: "123" }
];

const AuthExample = () => {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <AuthButton />

          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>

          <Switch>
            <Route path="/public">
              <PublicPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <PrivateRoute path="/protected">
              <ProtectedPage />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const authContext = createContext();

const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

const useAuth = () => {
  return useContext(authContext);
}

const useProvideAuth = () => {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

const AuthButton = () => {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

const PrivateRoute = ({ children, ...rest }) => {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

const PublicPage = () => {
  return <h3>Public</h3>
 ;
}

const ProtectedPage = () => {
  return <h3>Protected</h3>;
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


export default AuthExample;