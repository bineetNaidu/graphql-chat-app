import React from 'react';
import { Container } from 'react-bootstrap';
import Register from './pages/Register';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Switch>
      <Container className="pt-5">
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Container>
    </Switch>
  );
}

export default App;
