import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import QueueContext from '@util/QueueContext';
import ShoppingCart from '@assets/shopping-cart-2-fill.svg';
import Crown from '@assets/vip-crown-2-fill.svg';

import {
  StyledQueueButton,
  StyledControllerContainer,
  StyledShopButton,
  StyledLeaderboardButton,
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

const ShopButton = () => {
  const ctx = useContext(QueueContext);
  const btnRef = useRef();

  useEffect(() => {
    if (btnRef && btnRef.current) {
      const buttonX = btnRef.current.offsetLeft + btnRef.current.offsetWidth / 2;
      const buttonY = btnRef.current.offsetTop + btnRef.current.offsetHeight / 2;

      ctx.setShopState({
        open: ctx.shopState.open,
        buttonX,
        buttonY,
      });
    }
  }, [ctx.finishedLoading]);

  return (
    <StyledShopButton
      onClick={function (e) {
        ctx.setShopState({
          open: true,
          buttonX: ctx.shopState.buttonX,
          buttonY: ctx.shopState.buttonY,
        });
      }}
      ref={btnRef}
    >
      <ShoppingCart />
    </StyledShopButton>
  );
};

const QueueController = () => (
  <StyledControllerContainer>
    <ShopButton />
    <QueueButton />
    <StyledLeaderboardButton>
      <Crown />
    </StyledLeaderboardButton>
  </StyledControllerContainer>
);

export default QueueController;
