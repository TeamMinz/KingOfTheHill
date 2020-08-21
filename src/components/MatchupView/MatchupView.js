import React, {useState, useEffect} from 'react';
import '../App/App.css';
import './MatchupView.css';
import Authentication from '../../util/Authentication/Authentication';

const MatchupView = (_props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);

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

  const MatchupEffect = () => {
    const handleMessage = (_target, _contentType, body) => {
      const message = JSON.parse(body);
      if (message.type == 'updateMatchup') {
        setCurrentMatchup(message.message);
      }
    };

    const handleAuthentication = (auth) => {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        fetchMatchup();
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
    <div className="Champion">
      {!CurrentMatchup && '👑 No Champion Yet!'}
      {CurrentMatchup &&
        `Now Playing: 👑 ${CurrentMatchup.champion.opaqueUserId} (27) v
        ${CurrentMatchup.challenger.opaqueUserId}`}
    </div>
  );
};
export default MatchupView;
