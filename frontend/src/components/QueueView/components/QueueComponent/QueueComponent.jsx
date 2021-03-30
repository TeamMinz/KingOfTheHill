import React, { useState, useEffect, useContext } from 'react';
import QueueContext from '@util/QueueContext';
import {
  StyledQueue,
  StyledQueueComponent,
  StyledJoin,
  StyledListContainer,
  StyledQueueButton,
  KickButton,
  StyledList,
} from './QueueComponent.style';

/**
 *
 * @returns {any} the jsx to render.
 */
const QueueComponent = () => {
  const ctx = useContext(QueueContext);

  // state stuff
  const [ButtonText, setButtonText] = useState('Loading...');
  const [ButtonAction, setButtonAction] = useState(() => {});

  // helper functions

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
          console.log('Kick failed');
        } else {
          console.log('kick successful');
        }
      })
      .catch((err) => {
        // TODO: log error.
        console.log(err);
      });
  };

  /**
   * Adds the User to the Queue
   */
  const joinQueue = () => {
    ctx.auth.makeCall('/queue/join', 'POST').then((resp) => {
      if (resp.ok) {
        // eslint-disable-next-line no-use-before-define
        setButtonAction(() => leaveQueue);
        setButtonText('Leave the Queue');
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

  // called when the component mounts.

  // Controls the join / leave button
  useEffect(() => {
    if (ctx.finishedLoading && ctx.queue) {
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

  // console.log(authentication);

  /**
   * Creates the li element for each queue member
   *
   * @param {any} challenger challenger to render.
   * @param {number} index index of challenger.
   * @returns {any} rendered html.
   */
  const createUserEntry = (challenger, index) => (
    <li key={index}>
      <StyledListContainer>
        {challenger.displayName}
        {ctx.auth.isModerator() && (
          <KickButton
            type="button"
            className="KickButton"
            style={{ float: 'right' }}
            onClick={() => {
              kickPlayer(challenger.opaqueUserId);
            }}
          >
            X
          </KickButton>
        )}
      </StyledListContainer>
    </li>
  );

  const queueEntries = ctx.queue ? ctx.queue.queue.map(createUserEntry) : [];

  const userEntry = ctx.queue
    ? ctx.queue.queue.findIndex((challenger) => challenger.opaqueUserId === ctx.auth.getOpaqueId())
    : -1;

  if (
    queueEntries.length > 0
    && ctx.currentChampion
    && ctx.currentChampion.winStreak
    && ctx.queue.queue[0].opaqueUserId === ctx.currentChampion.user.opaqueUserId
  ) {
    queueEntries.shift();
  }

  return (
    <StyledQueueComponent>
      <StyledQueue>
        {queueEntries && queueEntries.length > 0 && (
          <div>
            <StyledList>{queueEntries.slice(0, 5)}</StyledList>
            {userEntry > 4 && (
              <div>
                ...
                <br />
                <StyledList start={userEntry + 1}>
                  {createUserEntry(ctx.queue.queue[userEntry], userEntry)}
                </StyledList>
              </div>
            )}
            {userEntry <= 4 && ctx.queue.queue.length > 5 && (
              <div>
                ...
                <br />
                <StyledList start={ctx.queue.queue.length}>
                  {createUserEntry(
                    ctx.queue.queue[ctx.queue.queue.length - 1],
                    ctx.queue.queue.length - 1,
                  )}
                </StyledList>
              </div>
            )}
          </div>
        )}
      </StyledQueue>
      <StyledJoin>
        <StyledQueueButton
          type="button"
          className="QueueButton"
          onClick={ButtonAction}
          disabled={!ctx.auth.getUserId() || !(ctx.queue && ctx.queue.isOpen)}
        >
          {ButtonText}
        </StyledQueueButton>
      </StyledJoin>
    </StyledQueueComponent>
  );
};

export default QueueComponent;
