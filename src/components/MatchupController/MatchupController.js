import React, {useState, useEffect} from 'react';
import Authentication from '../../util/Authentication/Authentication';
import './MatchupController.css';

const MatchupController = (props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  const [CurrentMatchup, setCurrentMatchup] = useState(null);
  const [FinishedLoading, setFinishedLoading] = useState(false);

  const startMatchup = () => {
    if (FinishedLoading) {
      console.log('sending request to start matchup');
      authentication
          .makeCall('https://localhost:8081/matchup/start', 'POST')
          .then((resp) => {
            if (resp.ok) {
              console.log(resp);

              resp.json().then((resp) => {
                console.log('started a matchup: ' + resp);
                setCurrentMatchup(resp.matchup);
              });
            } else {
              console.log('Error starting matchup.');
              // Display error
            }
          });
    }
  };

  const declareWinner = (winner) => {
    authentication
        .makeCall('https://localhost:8081/matchup/current/report', 'POST', {winner})
        .then((resp) => {
          if (resp.ok) {
            setCurrentMatchup(null);
            console.log(`${winner} has been declared the winner.`);
          } else {
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
            declareWinner('player1');
          }}
        >
          Player 1
        </button>
        vs
        <button
          onClick={() => {
            declareWinner('player2');
          }}
        >
          Player 2
        </button>
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
