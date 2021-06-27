import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import QueueContext from '@util/QueueContext';
import ArrowLeft from '@assets/arrow-left-fill.svg';
import {
  StyledOverlayContainer,
  StyledOverlayInner,
  StyledOverlayHeader,
  StyledCloseButton,
  StyledOverlayDivider,
  StyledOverlayTitle,
} from './OverlayComponent.style';

const LeaderboardComponent = () => {
  const ctx = useContext(QueueContext);
  const overlayRef = useRef();
  const [LeaderboardState, setLeaderboardState] = useState('closed');

  useEffect(() => {
    if (ctx.leaderboardState.leaderboardOpen && LeaderboardState == 'closed') {
      setLeaderboardState('opening');
    } else if (!ctx.leaderboardState.leaderboardOpen && LeaderboardState == 'open') {
      setLeaderboardState('closing');
    }
  });

  useEffect(() => {
    const updateLeaderboardState = (e) => {
      if (!(e.srcElement == overlayRef.current && e.propertyName == 'clip-path')) return;

      if (LeaderboardState == 'opening') {
        setLeaderboardState('open');
      } else if (LeaderboardState == 'closing') {
        setLeaderboardState('closed');
      }
    };

    if (overlayRef && overlayRef.current) {
      overlayRef.current.addEventListener('transitionend', updateLeaderboardState);
      return () => {
        overlayRef.current.removeEventListener('transitionend', updateLeaderboardState);
      };
    }
  }, [ctx.finishedLoading, LeaderboardState]);

  return (
    <StyledOverlayContainer
      ref={overlayRef}
      animState={LeaderboardState}
      buttonX={ctx.leaderboardState.buttonX}
      buttonY={ctx.leaderboardState.buttonY}
    >
      <StyledOverlayInner
        animState={LeaderboardState}
        buttonX={ctx.leaderboardState.buttonX}
        buttonY={ctx.leaderboardState.buttonY}
      >
        <StyledOverlayHeader>
          <StyledCloseButton
            onClick={() => {
              ctx.setLeaderboardState({
                shopOpen: false,
                buttonX: ctx.leaderboardState.buttonX,
                buttonY: ctx.leaderboardState.buttonY,
              });
            }}
          >
            <ArrowLeft />
          </StyledCloseButton>
          <StyledOverlayTitle>Leaderboard</StyledOverlayTitle>
        </StyledOverlayHeader>
        <StyledOverlayDivider />
      </StyledOverlayInner>
    </StyledOverlayContainer>
  );
};

export default LeaderboardComponent;
