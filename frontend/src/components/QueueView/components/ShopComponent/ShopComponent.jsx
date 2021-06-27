import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import QueueContext from '@util/QueueContext';
import ArrowLeft from '@assets/arrow-left-fill.svg';
import {
  StyledOverlayContainer,
  StyledShopContainer,
  StyledShopHeader,
  StyledCloseButton,
  StyledShopDivider,
  StyledShopTitle,
} from './ShopComponent.style';

const ShopComponent = () => {
  const ctx = useContext(QueueContext);
  const overlayRef = useRef();
  const [ShopState, setShopState] = useState('closed');

  useEffect(() => {
    console.log(ShopState);
  }, [ShopState]);

  useEffect(() => {
    if (ctx.shopState.open && ShopState == 'closed') {
      setShopState('opening');
    } else if (!ctx.shopState.open && ShopState == 'open') {
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
        overlayRef.current.removeEventListener('transitionend', updateShopState);
      };
    }
  }, [ctx.finishedLoading, ShopState]);

  return (
    <StyledOverlayContainer
      ref={overlayRef}
      shopOpen={ctx.shopState.open}
      shopState={ShopState}
      buttonX={ctx.shopState.buttonX}
      buttonY={ctx.shopState.buttonY}
    >
      <StyledShopContainer
        shopOpen={ctx.shopState.open}
        shopState={ShopState}
        buttonX={ctx.shopState.buttonX}
        buttonY={ctx.shopState.buttonY}
      >
        <StyledShopHeader>
          <StyledCloseButton
            onClick={() => {
              ctx.setShopState({
                open: false,
                buttonX: ctx.shopState.buttonX,
                buttonY: ctx.shopState.buttonY,
              });
            }}
          >
            <ArrowLeft />
          </StyledCloseButton>
          <StyledShopTitle>Shop</StyledShopTitle>
        </StyledShopHeader>
        <StyledShopDivider />
      </StyledShopContainer>
    </StyledOverlayContainer>
  );
};
/*  */
export default ShopComponent;
