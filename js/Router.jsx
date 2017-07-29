import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import Trck from './pages/Trck'
import LiveTracking from './pages/LiveTracking.jsx'
import RecordListing from './pages/RecordListing.jsx'
import ManualTracking from './pages/ManualTracking.jsx'

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Trck} >
      <IndexRedirect to="/live" />
      <Route path="/live" component={LiveTracking} />
      <Route path="/list" component={RecordListing} />
      <Route path="/manual" component={ManualTracking} />ß
    </Route>

  </Router>,
  document.getElementById('app')
)