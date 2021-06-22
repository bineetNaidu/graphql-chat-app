import { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { Col } from 'react-bootstrap';
import { useMessageDispatch, useMessageState } from '../../context/message';

const GET_MESSAGES = gql`
  query GetMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      content
      from
      to
      createdAt
    }
  }
`;

const Messages = () => {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();

  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [selectedUser, getMessages, messagesData, dispatch]);

  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p>Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p>Loading..</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message) => (
      <p key={message.uuid}>{message.content}</p>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = <p>You are now connected! send your first message!</p>;
  }

  return <Col xs={8}>{selectedChatMarkup}</Col>;
};

export default Messages;
