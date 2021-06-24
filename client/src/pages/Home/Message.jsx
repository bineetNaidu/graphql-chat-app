import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useAuthState } from '../../context/auth';

export default function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;

  return (
    <OverlayTrigger
      placement={sent ? 'right' : 'left'}
      overlay={
        <Tooltip>
          {moment(new Date(parseInt(message.createAt))).fromNow()}
        </Tooltip>
      }
      transition={false}
    >
      <div
        className={classNames('d-flex my-3', {
          'ml-auto': sent,
          'mr-auto': received,
        })}
      >
        <div
          className={classNames('py-2 px-3 rounded-pill', {
            'bg-primary': sent,
            'gray-bg': received,
          })}
        >
          <p
            className={classNames('mb-0', { 'text-white': sent })}
            key={message.uuid}
          >
            {message.content}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  );
}
