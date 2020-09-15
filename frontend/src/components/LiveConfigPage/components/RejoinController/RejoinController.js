import React, {useState, useEffect} from 'react';
import Collapsible from 'react-collapsible';
import './RejoinController.css';
/**
 * Rejoin Component for LiveConfig
 * Handles readding the broadcaster to the queue
 *
 * @param {object} props - components
 * @returns {string} html markup for Rejoin
 */
const RejoinController = (props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [AutoRejoin, setAutoRejoin] = useState(false);
  const [Position, setPosition] = useState('');

  /**
   * Saves settings configuration.
   */
  const updateSettings = () => {
    if (FinishedLoading) {
      twitch.configuration.set(
          'broadcaster',
          '0.2',
          JSON.stringify({
            rejoin: AutoRejoin,
            position: Position,
          }),
      );
    }
  };

  // make sure we authorize when the page loads.
  useEffect(() => {
    twitch.onAuthorized((auth) => {
      if (!FinishedLoading) {
        setFinishedLoading(true);
      }
    });
  });

  useEffect(() => {
    if (FinishedLoading) {
      if (twitch.configuration.broadcaster) {
        try {
          const config = JSON.parse(twitch.configuration.broadcaster.content);

          setAutoRejoin(config.rejoin);
          setPosition(config.position);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [FinishedLoading]);

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
              checked={AutoRejoin}
              onChange={() => setAutoRejoin(!AutoRejoin)}
            />
            {AutoRejoin && (
              <div>
                Position to rejoin (leave blank to rejoin at the end):
                <input
                  type="number"
                  min="1"
                  onChange={(e) => setPosition(e.target.value)}
                  value={Position}
                />
              </div>
            )}
          </div>

          <button className="DefaultButton" onClick={updateSettings}>
            Save Changes
          </button>
        </div>
      </Collapsible>
    </div>
  );
};

export default RejoinController;
