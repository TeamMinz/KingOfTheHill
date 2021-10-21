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

const ShopComponent = () => {
  const ctx = useContext(QueueContext);
  const overlayRef = useRef();
  const [ShopState, setShopState] = useState('closed');

  useEffect(() => {
    if (ctx.shopState.shopOpen && ShopState == 'closed') {
      setShopState('opening');
    } else if (!ctx.shopState.shopOpen && ShopState == 'open') {
      setShopState('closing');
    }
  });

  useEffect(() => {
    const updateShopState = (e) => {
      if (!(e.srcElement == overlayRef.current && e.propertyName == 'clip-path')) return;

      if (ShopState == 'opening') {
        setShopState('open');
      } else if (ShopState == 'closing') {
        setShopState('closed');
      }
    };

    if (overlayRef && overlayRef.current) {
      overlayRef.current.addEventListener('transitionend', updateShopState);
      return () => {
        if (overlayRef && overlayRef.current) {
          overlayRef.current.removeEventListener('transitionend', updateShopState);
        }
      };
    }
  }, [ctx.finishedLoading, ShopState]);

  return (
    <StyledOverlayContainer
      ref={overlayRef}
      animState={ShopState}
      buttonX={ctx.shopState.buttonX}
      buttonY={ctx.shopState.buttonY}
    >
      <StyledOverlayInner
        animState={ShopState}
        buttonX={ctx.shopState.buttonX}
        buttonY={ctx.shopState.buttonY}
      >
        <StyledOverlayHeader>
          <StyledCloseButton
            onClick={() => {
              ctx.setShopState({
                shopOpen: false,
                buttonX: ctx.shopState.buttonX,
                buttonY: ctx.shopState.buttonY,
              });
            }}
          >
            <ArrowLeft />
          </StyledCloseButton>
          <StyledOverlayTitle>Shop</StyledOverlayTitle>
        </StyledOverlayHeader>
        <StyledOverlayDivider />
      </StyledOverlayInner>
    </StyledOverlayContainer>
  );
};

export default ShopComponent;