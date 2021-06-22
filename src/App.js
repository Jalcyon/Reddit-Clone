import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Comments from './components/Comments'
import Header from './components/Header'
import Posts  from "./components/Posts"
import Subreddits from './components/Subreddits'
import Subreddit from './components/Subreddit'
import { getUserInfo } from "./API/users"

export const LoggedInContext = createContext()

function App() {
  const [userSignedIn, setUserSignedIn] = useState(false)

  useEffect(() => {
    // use firestore sign up stuff/localstorage stuff
    if(localStorage.getItem("curr_user") !== null) {
      signIn(localStorage.getItem("curr_user"))
    }
  }, [])

  function signOut() {
    setUserSignedIn(false)
    localStorage.removeItem("curr_user")
    // add localstorage clear
  }

  function signIn(username) {
    localStorage.setItem('curr_user', username)
    getUserInfo(username).then(user => localStorage.setItem("userInfo", JSON.stringify(user)))
    setUserSignedIn(true)
    // add localstorage setitem
  }

  return (
    <LoggedInContext.Provider value={userSignedIn}>
      <Router>
        <div className="">
        <Header signOutFunc={signOut} signInFunc={signIn} />

        <Switch>
          <Route exact path='/' component={Posts} />
          <Route path='/subreddits' component={Subreddits} />
          <Route path='/:subreddit/comments/:postid' component={Comments} />
          <Route exact path='/:subreddit' component={Subreddit} />
          
        </Switch>
        
      </div>
      </Router>
      </LoggedInContext.Provider>
  );
}

export default App;
