import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import './RejoinController.css';
/**
 * Rejoin Component for LiveConfig
 * Handles readding the broadcaster to the queue
 *
 * @param {object} props - components
 * @param {object} props.settings Settings object for the rejoin settings.
 * @param {Function} props.onChange Callback function for when settings change.
 * @returns {string} html markup for Rejoin
 */
const RejoinController =
({
  settings = {},
  onChange = () => {},
}) => {
  const rejoinSettings = ('rejoinSettings' in settings)? settings.rejoinSettings : {};
  const autoRejoin = ('autoRejoin' in rejoinSettings)? rejoinSettings.autoRejoin : false;
  const rejoinPosition = ('rejoinPosition' in rejoinSettings)? rejoinSettings.rejoinPosition : 5;

  return (
    <div className="Well">
      <Collapsible
        trigger="Rejoin Settings"
        triggerClassName="DropdownTrigger"
        triggerOpenedClassName="DropdownTrigger--open"
        easing="ease-out"
        open={true}
        transitionTime={250}
      >
        <div className="RejoinController">
          <div style={{display: 'block'}}>
            Automatically rejoin the queue?
            <input
              type="checkbox"
              checked={autoRejoin}
              onChange={() => {
                onChange({autoRejoin: !autoRejoin, rejoinPosition});
              }}
            />
            {autoRejoin && (
              <div>
                Position to rejoin (leave blank to rejoin at the end):
                <input
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
              </div>
            )}
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

RejoinController.propTypes = {
  settings: PropTypes.object,
  onChange: PropTypes.func,
};

export default RejoinController;
