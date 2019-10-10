import * as React from 'react';
import './App.css';
import { Switch, Route, withRouter, RouteComponentProps, Link } from 'react-router-dom';
import Home from './home/Home';
import Create from './customer/Create';
import EditCustomer from './customer/Edit';
import Login from './login/Login';

class App extends React.Component<RouteComponentProps<any>> {
  public render() {
    return (
      <div className="conten-holder">
        {/* <nav>
          <ul>
            <li>
              <Link to={'/home'}> Home </Link>
            </li>
            <li>
              <Link to={'/create'}> Create Customer </Link>
            </li>
          </ul>
        </nav> */}
        <Switch>
          <Route path={'/'} exact component={Home} />
          <Route path={'/home'} exact component={Home} />
          <Route path={'/create'} exact component={Create} />
          <Route path={'/edit/:id'} exact component={EditCustomer} />
        </Switch>
      </div>
    );
  }
}
export default withRouter(App);