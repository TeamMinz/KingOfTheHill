import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from '../Collapsible/Collapsible';
import {
  StyledCheckbox,
  StyledFormRow,
  StyledFormLabel,
  StyledFormContainer,
  Well,
} from '../../LiveConfigPage.style';

/**
 *  Watchdog controller component for the liveconfig.
 *  Lets you enable and disable the chatbot.
 *
 * @param {object} props Properties for the component
 * @param {object} props.settings current state of the settings.
 * @param {Function} props.onChange callback when any values change.
 * @returns {string} html markup for Watchdog controller.
 */
const WatchdogController = ({ settings = {}, onChange = () => {} }) => {
  const watchdogSettings = 'watchdogSettings' in settings ? settings.watchdogSettings : {};
  const enableWatchdog = 'enableWatchdog' in watchdogSettings ? watchdogSettings.enableWatchdog : false;

  return (
    <Well>
      <Collapsible title="Chatbot Settings" isOpen>
        <StyledFormContainer>
          <StyledFormRow>
            <StyledFormLabel htmlFor="ChatCommandsCheckBox">Enable chat commands?</StyledFormLabel>
            <StyledCheckbox
              id="ChatCommandsCheckBox"
              type="checkbox"
              checked={enableWatchdog}
              onChange={() => {
                onChange({ enableWatchdog: !enableWatchdog });
              }}
            />
          </StyledFormRow>
        </StyledFormContainer>
      </Collapsible>
    </Well>
  );
};

WatchdogController.propTypes = {
  settings: PropTypes.shape({
    enableWatchdog: PropTypes.bool,
  }),
  onChange: PropTypes.func.isRequired,
};

WatchdogController.defaultProps = {
  settings: {
    enableWatchdog: false,
  },
};

export default WatchdogController;
