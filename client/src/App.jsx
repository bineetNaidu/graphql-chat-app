import React from 'react';
import { Container } from 'react-bootstrap';
import Register from './pages/Register';
import { Switch } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import DynamicRoute from './utils/DynamicRoute';

function App() {
  return (
    <Switch>
      <Container className="pt-5">
        <DynamicRoute authenticated exact path="/" component={Home} />
        <DynamicRoute exact path="/register" component={Register} />
        <DynamicRoute exact path="/login" component={Login} />
      </Container>
    </Switch>
  );
}

export default App;
