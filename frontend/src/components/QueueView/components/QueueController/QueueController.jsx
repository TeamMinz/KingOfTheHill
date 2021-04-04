import React, { useState, useEffect, useContext } from 'react';
import QueueContext from '@util/QueueContext';
import ShoppingCart from '@assets/shopping-cart-2-fill.svg';
import {
  StyledQueueButton,
  StyledControllerContainer,
  StyledShopButton,
} from './QueueController.style';

const QueueButton = () => {
  const ctx = useContext(QueueContext);

  // state stuff
  const [ButtonText, setButtonText] = useState('Loading...');
  const [ButtonAction, setButtonAction] = useState(() => {});

  /**
   * Adds the User to the Queue
   */
  const joinQueue = () => {
    ctx.auth.makeCall('/queue/join', 'POST').then((resp) => {
      if (resp.ok) {
        // eslint-disable-next-line no-use-before-define
        setButtonAction(() => leaveQueue);
        setButtonText('Leave The Queue');
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
        setButtonText('Join The Queue');
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
        setButtonText('Join The Queue');
      } else {
        setButtonAction(() => leaveQueue);
        setButtonText('Leave The Queue');
      }
    }
  }, [ctx.queue]);

  return <StyledQueueButton onClick={ButtonAction}>{ButtonText}</StyledQueueButton>;
};

const QueueController = () => (
  <StyledControllerContainer>
    <StyledShopButton>
      <ShoppingCart />
    </StyledShopButton>
    <QueueButton />
    <button>leaderboard</button>
  </StyledControllerContainer>
);

export default QueueController;
