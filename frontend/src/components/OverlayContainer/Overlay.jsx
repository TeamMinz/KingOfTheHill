import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import Image from 'next/image';
import logo from '../../../assets/logo.png';
import {
  StyledOverlayContainer,
  StyledButton,
  StyledButtonWrapper,
  StyledExit,
  StyledImage,
} from './Overlay.style';
import App from '../App/App';

const popupTimer = (setPopup) => {
  setPopup(true);
  setTimeout(() => {
    setPopup(false);
  }, 5000);
};

const Overlay = () => {
  const [windowHeight, setHeight] = useState(600);
  const [showApp, setShowApp] = useState(false);
  const [popup, setPopup] = useState(false);
  setInterval(() => {
    popupTimer(setPopup);
  }, 1000 * 60 * 15);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHeight(window.innerHeight);
    }
  }, []);

  if (showApp) {
    return (
      <Rnd
        default={{
          x: 0,
          y: 50,
          width: (windowHeight * 0.65 * 3) / 4,
          height: windowHeight * 0.65,
        }}
        minHeight={330}
        minWidth={247}
        maxHeight={500}
        maxWidth={500}
        lockAspectRatio
      >
        <StyledOverlayContainer>
          <StyledExit type="button" onClick={() => setShowApp(false)}>
            x
          </StyledExit>
          <App format="component" />
        </StyledOverlayContainer>
      </Rnd>
    );
  }
  return (
    <StyledButtonWrapper popup={popup}>
      <StyledButton type="button" onClick={() => setShowApp(true)}>
        Join the Queue!
        <Image src={logo} alt="King of the Hill" height={50} width={50} />
      </StyledButton>
    </StyledButtonWrapper>
  );
};

export default Overlay;
