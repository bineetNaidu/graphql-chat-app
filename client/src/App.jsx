import React from 'react';
import { Container } from 'react-bootstrap';
import Register from './pages/Register';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Switch>
      <Container className="pt-5">
        <Route exact path="/" render={() => <h1>Hei</h1>} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Container>
    </Switch>
  );
}

export default App;
