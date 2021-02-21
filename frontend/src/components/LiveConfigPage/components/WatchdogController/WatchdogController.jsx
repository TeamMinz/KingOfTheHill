import React from 'react';
import Collapsible from 'react-collapsible';
import PropTypes from 'prop-types';

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
    <div className="Well">
      <Collapsible
        trigger="Chatbot Settings"
        triggerClassName="DropdownTrigger"
        triggerOpenedClassName="DropdownTrigger--open"
        easing="ease-out"
        open
        transitionTime={250}
      >
        <div className="WatchdogController">
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
        </div>
      </Collapsible>
    </div>
  );
};

WatchdogController.propTypes = {
  settings: PropTypes.object,
  onChange: PropTypes.func,
};

export default WatchdogController;
