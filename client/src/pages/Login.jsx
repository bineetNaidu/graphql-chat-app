import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../context/auth';

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        username
        email
        imageUrl
      }
      token
    }
  }
`;

export default function Login({ history }) {
  const [login] = useMutation(LOGIN);
  const [variables, setVariables] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const dispatch = useAuthDispatch();

  const submitLoginForm = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables,
      });
      dispatch({
        type: 'LOGIN',
        payload: data.login,
      });
      history.push('/');
    } catch (err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    }
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={submitLoginForm}>
          <Form.Group>
            <Form.Label className={errors.username && 'text-danger'}>
              {errors.username ? errors.username : 'Username'}
            </Form.Label>
            <Form.Control
              className={errors.username && 'is-invalid'}
              type="text"
              value={variables.username}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.password && 'text-danger'}>
              {errors.password ? errors.password : 'Password'}
            </Form.Label>
            <Form.Control
              className={errors.password && 'is-invalid'}
              type="password"
              value={variables.password}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit">
              Login
            </Button>
            <br />
            <small>
              Dont Have an account? <Link to="/register">Register!</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
