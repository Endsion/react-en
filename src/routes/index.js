import React from 'react';
import { Route, IndexRoute } from 'react-router-dom';

import { redirectToApp, redirectToLogin } from '../utils/route';

import App from '../containers/App';
import Dashboard from '../containers/Dashboard';

function redirectToLoginOnChange(prevState, nextState, replace) {
  redirectToLogin(nextState, replace);
}


export default (
  <Route path="/">
    <IndexRoute component={App} onEnter={redirectToApp} />
    <Route path="sign-up" component={App} onEnter={redirectToApp} />
    // another dashboard just for someone prefers old fashioned metal style
    <Route
      path="pool-dashboard"
      component={App}
      // onChange={redirectToLoginOnChange}
      // onEnter={redirectToLogin}
    />
    <Route
      path="app"
      component={App}
      onChange={redirectToLoginOnChange}
      onEnter={redirectToLogin}
    >
      <IndexRoute component={Dashboard} />
    </Route>
  </Route>
)