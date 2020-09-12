import React, {useState, useEffect} from 'react';
import Authentication from '../../../../util/Authentication/Authentication';
import './MatchupController.css';
import '../../LiveConfigPage.css';

/**
 * Matchup Component for Config
 * Handles starting matchup, declaring winner
 *
 * @param {object} props - components
 * @returns {string} html markup for Mathcup
 */
const MatchupController = (props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  const [CurrentMatchup, setCurrentMatchup] = useState(null);
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [ShowForfeitMenu, setShowForfeitMenu] = useState(false);

  /**
   * Sends request to start a new matchup
   */
  const startMatchup = () => {
    if (FinishedLoading) {
      console.log('sending request to start matchup');
      authentication.makeCall('/matchup/start', 'POST').then((resp) => {
        if (resp.ok) {
          resp.json().then((resp) => {
            // console.log('started a matchup: ' + resp);
            setCurrentMatchup(resp.matchup);
          });
        } else {
          console.log('Error starting matchup.');
          // Display error
        }
      });
    }
  };

  /**
   * Sends a request to declare a winner
   *
   * @param {string} winner - champion or challenger
   */
  const declareWinner = (winner) => {
    authentication
        .makeCall('/matchup/current/report', 'POST', {
          winner,
        })
        .then((resp) => {
          if (resp.ok) {
            setCurrentMatchup(null);
          // console.log(`${winner} has been declared the winner.`);
          } else {
          // TODO : add logging.
            console.log('there was an error processing the request.');
          }
        });
  };

  /**
   * Sends a request to forfeit a player.
   *
   * @param {string} player the player to forefeit: 'challenger' or 'champion'
   */
  const forfeitPlayer = (player) => {
    authentication
        .makeCall('/matchup/current/forfeit', 'POST', {
          player,
        })
        .then((resp) => {
          if (resp.ok) {
            setCurrentMatchup(null);
          } else {
          // TODO : add logging.
            console.log('there was an error processing the request.');
          }
        });
  };

  // make sure we authorize when the page loads.
  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!FinishedLoading) {
          authentication.makeCall('/matchup/current/get').then((resp) => {
            if (resp.ok) {
              resp.json().then((resp) => {
                setCurrentMatchup(resp.matchup);
              });
            } else {
              // TODO: add logging.
            }
          });

          setFinishedLoading(true);
        }
      });
    }
  });

  // Stuff for rendering.

  const matchupView = null;

  const matchupController = (CurrentMatchup != null && FinishedLoading && (
    <div>
      <button
        className="DefaultButton"
        onClick={() => {
          declareWinner('champion');
        }}
      >
        {CurrentMatchup.champion.displayName}
      </button>
      vs
      <button
        className="DefaultButton"
        onClick={() => {
          declareWinner('challenger');
        }}
      >
        {CurrentMatchup.challenger.displayName}
      </button>
      {(ShowForfeitMenu && (
        <div>
          <button
            className="DefaultButton"
            onClick={() => {
              forfeitPlayer('champion');
            }}
          >
            {CurrentMatchup.champion.displayName}
          </button>
          or
          <button
            className="DefaultButton"
            onClick={() => {
              forfeitPlayer('challenger');
            }}
          >
            {CurrentMatchup.challenger.displayName}
          </button>
        </div>
      )) || (
        <button
          className="DefaultButton"
          onClick={() => {
            setShowForfeitMenu(true);
          }}
        >
          Forfeit a player
        </button>
      )}
    </div>
  )) || (
    <div className="MatchupController">
      <button className="DefaultButton" onClick={startMatchup}>
        Start Matchup!
      </button>
    </div>
  );

  return <div className="Well">{matchupController}</div>;
};

export default MatchupController;
