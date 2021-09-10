import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./components/screens/Home";
// import UserProfile from "./components/screens/UserProfile";

import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
// import Profile from "./components/screens/Profile";
import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer, initialState } from "./reducer/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("userInfo"));
    if (currentUser) {
      dispatch({ type: "USER", payload: currentUser });
      history.push("/");
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={Login} />
        <Route exact path="/register" component={Signup} />
        {/* <Route exact path="/profile" component={Profile} /> */}
        {/* <Route path="/profile/:userid" component={UserProfile} /> */}
      </Switch>
    </>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <UserContext.Provider value={{ state, dispatch }}>
        <Router>
          <Navbar />
          <Routing />
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
