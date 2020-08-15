import React, {useState} from 'react';
import './MatchupController.css';

const MatchupController = (props) => {
  const [CurrentMatchup, setCurrentMatchup] = useState(null);

  const startMatchup = () => {
    setCurrentMatchup({
      playerOne: 'pycses',
      playerTwo: 'tminz',
    });
  };

  const declareWinner = (winner) => {
    twitch.ext.log(winner + ' has won!');

    setCurrentMatchup(null);
  };

  if (CurrentMatchup != null) {
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
