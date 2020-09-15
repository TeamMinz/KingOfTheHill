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

  useEffect(() => {
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
  }, [Position, AutoRejoin]);

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
                onChange={(e) => setPosition(e.target.value)}
                value={Position}
              />
            </div>
          )}
        </div>
      </Collapsible>
    </div>
  );
};

export default RejoinController;
