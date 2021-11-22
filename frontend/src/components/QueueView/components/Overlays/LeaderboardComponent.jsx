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
import LeaderboardView from './Leaderboard/LeaderboardView';

const LeaderboardComponent = () => {
  const ctx = useContext(QueueContext);
  const overlayRef = useRef();
  const [LeaderboardState, setLeaderboardState] = useState('closed');

  useEffect(() => {
    if (ctx.leaderboardState.leaderboardOpen && LeaderboardState === 'closed') {
      setLeaderboardState('opening');
    } else if (!ctx.leaderboardState.leaderboardOpen && LeaderboardState === 'open') {
      setLeaderboardState('closing');
    }
  }, [LeaderboardState, ctx.leaderboardState.leaderboardOpen]);

  useEffect(() => {
    const updateLeaderboardState = (e) => {
      if (!(e.srcElement === overlayRef.current && e.propertyName === 'clip-path')) return;

      if (LeaderboardState === 'opening') {
        setLeaderboardState('open');
      } else if (LeaderboardState === 'closing') {
        setLeaderboardState('closed');
      }
    };

    if (overlayRef && overlayRef.current) {
      const overlayElem = overlayRef.current;
      overlayElem.addEventListener('transitionend', updateLeaderboardState);
      return () => {
        overlayElem.removeEventListener('transitionend', updateLeaderboardState);
      };
    }

    return null;
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
                leaderboardOpen: false,
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
        <LeaderboardView open={LeaderboardState === 'open'} />
      </StyledOverlayInner>
    </StyledOverlayContainer>
  );
};

export default LeaderboardComponent;
