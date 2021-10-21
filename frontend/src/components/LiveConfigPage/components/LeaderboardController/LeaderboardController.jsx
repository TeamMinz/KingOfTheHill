import React from 'react';
import {
  StyledFormContainer,
  StyledFormLabel,
  StyledFormRow,
  StyledNumberSpinner,
  Well,
} from '../../LiveConfigPage.style';
import Collapsible from '../Collapsible/Collapsible';

/**
 * Leaderboard controller for the live config page.
 * allows you to configure the leaderboard.
 */
const LeaderboardController = () => (
  <Well>
    <Collapsible title="Leaderboard Settings" isOpen>
      <StyledFormContainer>
        <StyledFormRow>
          <StyledFormLabel htmlFor="LeaderboardMaxSize">Leaderboard Size</StyledFormLabel>
          <StyledNumberSpinner type="number" min="1" max="100" id="LeaderboardMaxSize" />
        </StyledFormRow>
        <StyledFormRow style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
          <button type="button">Clear Leaderboard</button>
        </StyledFormRow>
      </StyledFormContainer>
    </Collapsible>
  </Well>
);

export default LeaderboardController;
