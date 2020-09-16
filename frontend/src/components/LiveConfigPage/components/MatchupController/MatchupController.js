import React, {useState, useContext} from 'react';
import QueueContext from '../../../../util/QueueContext';
import Collapsible from 'react-collapsible';
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
  const ctx = useContext(QueueContext);

  const [ShowForfeitMenu, setShowForfeitMenu] = useState(false);

  /**
   * Sends request to start a new matchup
   */
  const startMatchup = () => {
    if (ctx.finishedLoading) {
      console.log('sending request to start matchup');
      ctx.auth.makeCall('/matchup/start', 'POST').then((resp) => {
        if (resp.ok) {
          resp.json().then((resp) => {
            // console.log('started a matchup: ' + resp);
            // setCurrentMatchup(resp.matchup);
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
    ctx.auth
        .makeCall('/matchup/current/report', 'POST', {
          winner,
        })
        .then((resp) => {
          if (resp.ok) {
            // setCurrentMatchup(null);
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
    ctx.auth
        .makeCall('/matchup/current/forfeit', 'POST', {
          player,
        })
        .then((resp) => {
          if (resp.ok) {
            // setCurrentMatchup(null);
          } else {
          // TODO : add logging.
            console.log('there was an error processing the request.');
          }
        });
  };

  // Stuff for rendering.
  const matchupController = (ctx.finishedLoading && (ctx.currentMatchup && (
    <div>
      <button
        className="DefaultButton"
        onClick={() => {
          declareWinner('champion');
        }}
      >
        {ctx.currentMatchup.champion.displayName}
      </button>
      vs
      <button
        className="DefaultButton"
        onClick={() => {
          declareWinner('challenger');
        }}
      >
        {ctx.currentMatchup.challenger.displayName}
      </button>
      {(ShowForfeitMenu && (
        <div>
          <button
            className="DefaultButton"
            onClick={() => {
              forfeitPlayer('champion');
            }}
          >
            {ctx.currentMatchup.champion.displayName}
          </button>
          or
          <button
            className="DefaultButton"
            onClick={() => {
              forfeitPlayer('challenger');
            }}
          >
            {ctx.currentMatchup.challenger.displayName}
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
      <button
        className="DefaultButton"
        onClick={startMatchup}>
        Start Matchup!
      </button>
    </div>
  ));

  return <div className="Well">
    <Collapsible
      trigger="Matchup Controls"
      triggerClassName="DropdownTrigger"
      triggerOpenedClassName="DropdownTrigger--open"
      easing="ease-out"
      open={true}
      transitionTime={250}
    >
      {matchupController}
    </Collapsible>
  </div>;
};

export default MatchupController;
