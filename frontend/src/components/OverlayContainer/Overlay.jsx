import React from 'react';
import PropTypes from 'prop-types';
import { StyledOverlayContainer } from './Overlay.style';
import App from '../App/App';

const Overlay = (props) => {
    return (
        <StyledOverlayContainer>
            <App format="component" />
        </StyledOverlayContainer>
      );
}

export default Overlay;
