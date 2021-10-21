import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from '../Collapsible/Collapsible';
import {
  Well,
  StyledCheckbox,
  StyledFormRow,
  StyledNumberSpinner,
  StyledFormContainer,
} from '../../LiveConfigPage.style';
/**
 * Rejoin Component for LiveConfig
 * Handles readding the broadcaster to the queue
 *
 * @param {object} props - components
 * @param {object} props.settings Settings object for the rejoin settings.
 * @param {Function} props.onChange Callback function for when settings change.
 * @returns {string} html markup for Rejoin
 */
const RejoinController = ({ settings = {}, onChange = () => {} }) => {
  const rejoinSettings = 'rejoinSettings' in settings ? settings.rejoinSettings : {};
  const autoRejoin = 'autoRejoin' in rejoinSettings ? rejoinSettings.autoRejoin : false;
  const rejoinPosition = 'rejoinPosition' in rejoinSettings ? rejoinSettings.rejoinPosition : 5;

  return (
    <Well>
      <Collapsible title="Rejoin Settings" isOpen>
        <StyledFormContainer>
          <StyledFormRow>
            Automatically rejoin the queue?
            <StyledCheckbox
              type="checkbox"
              checked={autoRejoin}
              onChange={() => {
                onChange({ autoRejoin: !autoRejoin, rejoinPosition });
              }}
            />
          </StyledFormRow>
          {autoRejoin && (
            <StyledFormRow>
              Position to rejoin (leave blank to rejoin at the end):
              <StyledNumberSpinner
                type="number"
                min="1"
                onChange={(e) => {
                  onChange({
                    autoRejoin,
                    rejoinPosition: e.target.value,
                  });
                }}
                value={rejoinPosition}
              />
            </StyledFormRow>
          )}
        </StyledFormContainer>
      </Collapsible>
    </Well>
  );
};

RejoinController.propTypes = {
  settings: PropTypes.object,
  onChange: PropTypes.func,
};

export default RejoinController;
