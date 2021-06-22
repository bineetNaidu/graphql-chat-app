import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Image, Col } from 'react-bootstrap';

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

const Users = ({ setSelectedUser }) => {
  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    console.log(error);
  }

  let usersMarkup;
  if (!data || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map((user) => (
      <div
        className="d-flex p-3"
        key={user.username}
        onClick={() => setSelectedUser(user.username)}
      >
        <Image
          src={user.imageUrl}
          roundedCircle
          className="mr-2"
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
        <div>
          <p className="text-success mb-0">{user.username}</p>
          <p className="text-secondary mb-0">
            {user.latestMessage
              ? user.latestMessage.content
              : 'You are now connected!'}
          </p>
        </div>
      </div>
    ));
  }
  return (
    <Col xs={4} className="p-0" style={{ backgroundColor: 'rgb(245,245,245)' }}>
      {usersMarkup}
    </Col>
  );
};

export default Users;
