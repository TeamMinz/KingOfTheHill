import React, {useState, useEffect} from 'react';
import '../App/App.css';
import './MatchupView.css';
import Authentication from '../../util/Authentication/Authentication';

const MatchupView = (_props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);
  const [Champion, setChampion] = useState(null);
  const [winStreak, setWinstreak] = useState(0);

  const fetchMatchup = () => {
    authentication
        .makeCall('https://localhost:8081/matchup/current/get')
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((resp) => {
              setCurrentMatchup(resp.matchup);
            });
          }
        });
  };

  const fetchChampion = () => {
    authentication
        .makeCall('https://localhost:8081/champion/get')
        .then((resp) => {
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

  const MatchupEffect = () => {
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
