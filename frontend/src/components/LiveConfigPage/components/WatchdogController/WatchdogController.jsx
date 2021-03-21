import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from '../Collapsible/Collapsible';
import { Well } from '../../LiveConfigPage.style';
import { StyledWatchdogController } from './WatchdogController.style';

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
        <StyledWatchdogController>
          <div style={{ display: 'block' }}>
            <label htmlFor="ChatCommandsCheckBox">
              Enable chat commands?
              <input
                id="ChatCommandsCheckBox"
                type="checkbox"
                checked={enableWatchdog}
                onChange={() => {
                  onChange({ enableWatchdog: !enableWatchdog });
                }}
              />
            </label>
          </div>
        </StyledWatchdogController>
      </Collapsible>
    </Well>
  );
};

WatchdogController.propTypes = {
  settings: PropTypes.object,
  onChange: PropTypes.func,
};

export default WatchdogController;
