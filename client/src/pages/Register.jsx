import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';

const REGISTER = gql`
  mutation Register(
    $email: String!
    $username: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      email: $email
      username: $username
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      imageUrl
    }
  }
`;

export default function Register({ history }) {
  const [register] = useMutation(REGISTER);
  const [variables, setVariables] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const submitRegisterForm = async (e) => {
    e.preventDefault();
    try {
      await register({
        variables,
      });
      history.push('/login');
    } catch (err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    }
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label className={errors.email && 'text-danger'}>
              {errors.email ? errors.email : 'Email address'}
            </Form.Label>
            <Form.Control
              className={errors.email && 'is-invalid'}
              type="email"
              value={variables.email}
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
              }
            />
          </Form.Group>
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
          <Form.Group>
            <Form.Label className={errors.confirmPassword && 'text-danger'}>
              {errors.confirmPassword
                ? errors.confirmPassword
                : 'Confirm password'}
            </Form.Label>
            <Form.Control
              className={errors.confirmPassword && 'is-invalid'}
              type="password"
              value={variables.confirmPassword}
              onChange={(e) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
