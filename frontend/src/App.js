import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './views/Home.js'
import Login from './views/Login.js'
import Register from './views/Register.js'

function App() {
  const isLoggedin = function () {
    let token = sessionStorage.getItem('token')
    if (token) {
      return true
    }
    return false
  }

  return (
    <div>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route
          exact
          path="/login"
          render={() => (!isLoggedin() ? <Login /> : <Redirect to="/home" />)}
        />
        <Route
          exact
          path="/register"
          render={() =>
            !isLoggedin() ? <Register /> : <Redirect to="/home" />
          }
        />
        <Route
          path="/home"
          render={() => (isLoggedin() ? <Home /> : <Redirect to="/login" />)}
        />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  )
}

export default App
