import React, { Component, Suspense, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

const Dashboard = lazy(() => import('./dashboard/Dashboard'))
const InterviewScreen = lazy(() => import('./dashboard/InterviewScreen'))
const SubmitFeedback = lazy(() => import('./dashboard/SubmitFeedback'))

export class AppRoutes extends Component {
  render() {
    return (
      <Suspense fallback=''>
        <Switch>
          <Route exact path="/dashboard" component={ Dashboard } />
          <Route exact path="/interview" component={ InterviewScreen } />
          <Route exact path="/feedback" component={ SubmitFeedback } />
          <Route exact path="*">
            <Redirect to="/dashboard"></Redirect>
          </Route>
        </Switch>
      </Suspense>
    )
  }
}

export default AppRoutes
