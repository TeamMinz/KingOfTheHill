import QueueContext from '@util/QueueContext';
import React, { useContext, useEffect, useState } from 'react';
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
const LeaderboardController = () => {
  const ctx = useContext(QueueContext);
  const [MaxSize, setMaxSize] = useState(null);

  const clearQueue = () => {
    ctx.auth.makeCall('/leaderboard', 'DELETE');
  };

  useEffect(() => {
    if (ctx.finishedLoading) {
      ctx.auth.makeCall('/leaderboard/size', 'PUT', { size: MaxSize });
    }
  }, [ctx.finishedLoading, ctx.auth, MaxSize]);

  useEffect(() => {
    if (ctx.finishedLoading) {
      ctx.auth.makeCall('/leaderboard/size', 'GET').then(async (resp) => {
        if (!resp.ok) {
          return;
        }
        const json = await resp.json();
        setMaxSize(parseInt(json.size, 10));
      });
    }
  }, [ctx.finishedLoading, ctx.auth]);

  return (
    <Well>
      <Collapsible title="Leaderboard Settings" isOpen>
        <StyledFormContainer>
          <StyledFormRow>
            <StyledFormLabel htmlFor="LeaderboardMaxSize">
              Leaderboard Size
            </StyledFormLabel>
            <StyledNumberSpinner
              type="number"
              min="1"
              value={MaxSize || 10}
              onChange={(e) => setMaxSize(e.target.value)}
              max="100"
              id="LeaderboardMaxSize"
            />
          </StyledFormRow>
          <StyledFormRow
            style={{ justifyContent: 'center', marginTop: '0.25rem' }}
          >
            <button type="button" onClick={clearQueue}>
              Clear Leaderboard
            </button>
          </StyledFormRow>
        </StyledFormContainer>
      </Collapsible>
    </Well>
  );
};

export default LeaderboardController;
