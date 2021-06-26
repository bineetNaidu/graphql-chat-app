import React, { createContext, useReducer, useContext } from 'react';

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
  let usersCopy;
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'SET_USER_MESSAGES':
      const { username, messages } = action.payload;
      usersCopy = [...state.users];

      const userIndex = usersCopy.findIndex((u) => u.username === username);

      usersCopy[userIndex] = { ...usersCopy[userIndex], messages };

      return {
        ...state,
        users: usersCopy,
      };
    case 'SET_SELECTED_USER':
      usersCopy = state.users.map((user) => ({
        ...user,
        selected: user.username === action.payload,
      }));

      return {
        ...state,
        users: usersCopy,
      };

    case 'ADD_MESSAGE':
      usersCopy = [...state.users];
      const userIdx = usersCopy.findIndex(
        (u) => u.username === action.payload.username
      );

      action.payload.message.reactions = [];

      usersCopy[userIdx] = {
        ...usersCopy[userIdx],
        messages: usersCopy[userIdx].messages
          ? [action.payload.message, ...usersCopy[userIdx].messages]
          : null,
        latestMessage: action.payload.message,
      };

      return {
        ...state,
        users: usersCopy,
      };

    case 'ADD_REACTION':
      usersCopy = [...state.users];

      const idx = usersCopy.findIndex(
        (u) => u.username === action.payload.username
      );

      // Make a shallow copy of user
      let userCopy = { ...usersCopy[idx] };

      // Find the index of the message that this reaction pertains to
      const messageIndex = userCopy.messages?.findIndex(
        (m) => m.uuid === action.payload.reaction.message.uuid
      );

      if (messageIndex > -1) {
        // Make a shallow copy of user messages
        let messagesCopy = [...userCopy.messages];

        // Make a shallow copy of user message reactions
        let reactionsCopy = [...messagesCopy[messageIndex].reactions];

        const reactionIndex = reactionsCopy.findIndex(
          (r) => r.uuid === action.payload.reaction.uuid
        );

        if (reactionIndex > -1) {
          // Reaction exists, update it
          reactionsCopy[reactionIndex] = action.payload.reaction;
        } else {
          // New Reaction, add it
          reactionsCopy = [...reactionsCopy, action.payload.reaction];
        }

        messagesCopy[messageIndex] = {
          ...messagesCopy[messageIndex],
          reactions: reactionsCopy,
        };

        userCopy = { ...userCopy, messages: messagesCopy };
        usersCopy[idx] = userCopy;
      }

      return {
        ...state,
        users: usersCopy,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null });

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
