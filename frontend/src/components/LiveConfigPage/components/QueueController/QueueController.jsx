import React, { useState, useEffect, useContext } from 'react';
import Collapsible from '../Collapsible/Collapsible';
import QueueContext from '../../../../util/QueueContext';
import { StyledKickButton, StyledQueueController } from './QueueController.style';
import { Well } from '../../LiveConfigPage.style';

/**
 * Component that shows your current position in queue,
 * then allows you to join / leave it, from the live config page.
 *
 * @returns {Function} a cleanup function.
 */
const QueueController = () => {
  // State stuff.
  const [ButtonText, setButtonText] = useState('Loading...');
  const [ButtonAction, setButtonAction] = useState(() => {});

  // Context
  const ctx = useContext(QueueContext);

  /**
   * Adds the User to the Queue
   */
  const joinQueue = () => {
    ctx.auth.makeCall('/queue/join', 'POST').then((resp) => {
      if (resp.ok) {
        setButtonText('Leave the Queue');
        // eslint-disable-next-line no-use-before-define
        setButtonAction(() => leaveQueue);
      }
    });
  };

  /**
   * Removes the User from the Queue
   */
  const leaveQueue = () => {
    ctx.auth.makeCall('/queue/leave', 'POST').then((resp) => {
      if (resp.ok) {
        setButtonAction(() => joinQueue);
        setButtonText('Join the Queue');
      }
    });
  };

  /**
   * Interfaces with the backend to remove someone from the queue.
   *
   * @param {*} opaqueUserId The user to remove from the queue.
   */
  const kickPlayer = (opaqueUserId) => {
    ctx.auth
      .makeCall('/queue/kick', 'POST', {
        kickTarget: opaqueUserId,
      })
      .then((resp) => {
        if (!resp.ok) {
          // TODO: log error.
        }
      })
      .catch((err) => {
        // TODO: log error.
        console.log(err);
      });
  };

  /**
   * Interfaces with the backend to close the queue.
   */
  const closeQueue = () => {
    ctx.auth
      .makeCall('/queue/close', 'POST')
      .then((resp) => {
        if (!resp.ok) {
          // TODO: log error.
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Interfaces with the backend to open the queue.
   */
  const openQueue = () => {
    ctx.auth
      .makeCall('/queue/open', 'POST')
      .then((resp) => {
        if (!resp.ok) {
          // TODO: log error.
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Controls the join / leave button
  useEffect(() => {
    if (ctx.finishedLoading && ctx.queue) {
      // console.log(ctx.queue);
      if (
        ctx.queue.queue.findIndex(
          (challenger) => challenger.opaqueUserId === ctx.auth.getOpaqueId(),
        ) === -1
      ) {
        setButtonAction(() => joinQueue);
        setButtonText('Join the Queue');
      } else {
        setButtonAction(() => leaveQueue);
        setButtonText('Leave the Queue');
      }
    }
  }, [ctx.queue]);

  // called when the component mounts.

  if (ctx.finishedLoading && ctx.queue) {
    // console.log(ctx.queue);
    const userEntry = ctx.queue
      ? ctx.queue.queue.findIndex(
        (challenger) => challenger.opaqueUserId === ctx.auth.getOpaqueId(),
      )
      : -1;

    const queueEntries = ctx.queue
      ? ctx.queue.queue.map((challenger, index) => (
        <li key={index}>
          {challenger.displayName}
          {ctx.auth.isModerator() && (
          <StyledKickButton
            className="KickButton"
            style={{ float: 'right' }}
            onClick={() => {
              kickPlayer(challenger.opaqueUserId);
            }}
          >
            X
          </StyledKickButton>
          )}
        </li>
      ))
      : [];

    const queueView = (
      <div>
        <p>
          {(userEntry === -1 && "You're not currently in the queue.")
            || `You are #${userEntry + 1} in the queue`}
        </p>

        {queueEntries && queueEntries.length > 0 && (
          <div>
            <ol>{queueEntries.slice(0, 5)}</ol>
          </div>
        )}

        <button type="button" className="DefaultButton" onClick={ButtonAction}>
          {ButtonText}
        </button>
      </div>
    );

    return (
      <Well>
        <Collapsible title="Queue" isOpen>
          <StyledQueueController>
            {ctx.queue.isOpen && (
              <button type="button" className="DefaultButton" onClick={closeQueue}>
                Close the Queue
              </button>
            )}

            {ctx.queue.isOpen && queueView}

            {!ctx.queue.isOpen && (
              <button type="button" className="DefaultButton" onClick={openQueue}>
                Open the Queue
              </button>
            )}
          </StyledQueueController>
        </Collapsible>
      </Well>
    );
  }
  return null;
};

export default QueueController;
