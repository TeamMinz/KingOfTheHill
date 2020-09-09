import React, {useState, useEffect} from 'react';
import Authentication from '../../util/Authentication/Authentication';
import './MatchupController.css';

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

  if (CurrentMatchup != null && FinishedLoading) {
    return (
      <div className="MatchupController">
        Declare a winner:
        <button
          onClick={() => {
            declareWinner('champion');
          }}
        >
          {CurrentMatchup.champion.displayName}
        </button>
        vs
        <button
          onClick={() => {
            declareWinner('challenger');
          }}
        >
          {CurrentMatchup.challenger.displayName}
        </button>
        {!ShowForfeitMenu && (
          <button
            onClick={() => {
              setShowForfeitMenu(true);
            }}
          >
            Forfeit a player
          </button>
        )}
        {ShowForfeitMenu && (
          <div>
            Pick a player to forfeit:
            <button
              onClick={() => {
                forfeitPlayer('champion');
              }}
            >
              {CurrentMatchup.champion.displayName}
            </button>
            <button
              onClick={() => {
                forfeitPlayer('challenger');
              }}
            >
              {CurrentMatchup.challenger.displayName}
            </button>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="MatchupController">
        <button onClick={startMatchup}>Start Matchup!</button>
      </div>
    );
  }
};

export default MatchupController;
