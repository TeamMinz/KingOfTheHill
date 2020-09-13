import React, {useState, useEffect, useRef} from 'react';
import Authentication from '../../../../util/Authentication/Authentication';
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
  const authRef = useRef(new Authentication());
  const authentication = authRef.current;

  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [AutoRejoin, setAutoRejoin] = useState(props.AutoRejoin);
  const [Position, setPosition] = useState(props.Position);

  // make sure we authorize when the page loads.
  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!FinishedLoading) {
          setFinishedLoading(true);
        }
      });
    }
  });

  useEffect(() => {
    if (FinishedLoading) {
      twitch.rig.log(`${AutoRejoin} ${Position}`);
      twitch.configuration.set(
          'broadcaster',
          '1.0',
          JSON.stringify({
            AutoRejoin,
            Position,
          }),
      );
    }
  }, [Position, AutoRejoin]);

  return (
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
  );
};

export default RejoinController;
