import React, {useState, useEffect} from 'react';
import '../App/App.css';
import './MatchupView.css';
import Authentication from '../../util/Authentication/Authentication';

/**
 * Component to display current matchup/champion
 *
 * @param {object} _props - components
 * @returns {string} html markup for view
 */
const MatchupView = (_props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);
  const [Champion, setChampion] = useState(null);
  const [winStreak, setWinstreak] = useState(0);

  /**
   * Gets the current matchup from the server
   */
  const fetchMatchup = () => {
    authentication.makeCall('/matchup/current/get').then((resp) => {
      if (resp.ok) {
        resp.json().then((resp) => {
          setCurrentMatchup(resp.matchup);
        });
      }
    });
  };

  /**
   * Gets the current champion from the server
   */
  const fetchChampion = () => {
    authentication.makeCall('/champion/get').then((resp) => {
      if (resp.ok) {
        resp.json().then((resp) => {
          if (resp) {
            setChampion(resp.user);
            setWinstreak(resp.winStreak);
          } else {
            setChampion(null);
            setWinstreak(0);
          }
        });
      }
    });
  };

  /**
   * Custom Effect for MatchupView
   * Handles Twitch authentication and pubsubs
   *
   * @returns {Function} closing function to stop listening to twitch broadcasts
   */
  const MatchupEffect = () => {
    /**
     * handles pubsub messages 'updateMatchup' and 'updateChampion'
     *
     * @param _target
     * @param _contentType
     * @param body
     */
    const handleMessage = (_target, _contentType, body) => {
      const message = JSON.parse(body);
      if (message.type == 'updateMatchup') {
        setCurrentMatchup(message.message);
      } else if (message.type == 'updateChampion') {
        twitch.rig.log(JSON.stringify(message));
        if (message.message) {
          setChampion(message.message.user);
          setWinstreak(message.message.winStreak);
        } else {
          setChampion(null);
          setWinstreak(0);
        }
      }
    };

    /**
     * Handles authorizing with twitch and running first time setup
     *
     * @param {object} auth - twitch authentication information
     */
    const handleAuthentication = (auth) => {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        fetchMatchup();
        fetchChampion();
        setFinishedLoading(true);
      }
    };

    if (twitch) {
      twitch.onAuthorized(handleAuthentication);
      twitch.onVisibilityChanged((isVisible, context) => {
        if (isVisible) {
          twitch.listen('broadcast', handleMessage);
        }
      });
    }

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return () => {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
  };

  useEffect(MatchupEffect, [CurrentMatchup, FinishedLoading]);

  return (
    <div className="Matchup">
      <div className="Champion">
        {!Champion && '👑 No Champion Yet!'}
        {Champion && `👑: (${winStreak}) ${Champion.displayName}`}
      </div>
      <div className="Challenger">
        {CurrentMatchup && `⚔️: ${CurrentMatchup.challenger.displayName}`}
      </div>
    </div>
  );
};
export default MatchupView;
