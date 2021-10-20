import React, { useState, useContext } from 'react';
import QueueContext from '@util/QueueContext';
import {
  StyledQueue,
  StyledQueueComponent,
  StyledUserEntry,
  StyledUserIndex,
  StyledSoftEdge,
  HighlightedUserEntry,
  KickButton,
  StyledList,
  StyledListContainer,
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
          console.info('Kick failed'); // TODO: Add some better logging maybe? Show a message or something? Idk.
        } else {
          console.info('kick successful');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * Creates the li element for each queue member
   *
   * @param {any} challenger challenger to render.
   * @param {number} index index of challenger.
   * @returns {any} rendered html.
   */
  const createUserEntry = (challenger, index) => {
    const indexComp = (
      <StyledUserIndex>
        {index + 1}
        .
      </StyledUserIndex>
    );

    const kickButton = ctx.auth.isModerator() && (
      <KickButton
        type="button"
        onClick={() => {
          kickPlayer(challenger.opaqueUserId);
        }}
      >
        X
      </KickButton>
    );

    if (challenger.opaqueUserId === ctx.auth.getOpaqueId()) {
      return (
        <HighlightedUserEntry key={challenger.userId}>
          {indexComp}
          {challenger.displayName}
        </HighlightedUserEntry>
      );
    }
    return (
      <StyledUserEntry key={challenger.userId}>
        {indexComp}
        {challenger.displayName}
        {kickButton}
      </StyledUserEntry>
    );
  };

  const queueEntries = ctx.queue ? ctx.queue.queue.map(createUserEntry) : [];

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
          <StyledListContainer>
            <StyledSoftEdge />
            <StyledList>{queueEntries}</StyledList>
            <StyledSoftEdge />
          </StyledListContainer>
        )}
      </StyledQueue>
    </StyledQueueComponent>
  );
};

export default QueueComponent;
