import React, {useState, useEffect} from 'react';
import Authentication from '../../util/Authentication/Authentication';
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
  const authentication = new Authentication();

  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [AutoRejoin, setAutoRejoin] = useState(false);
  const [Position, setPosition] = useState('');

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
