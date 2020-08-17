import React, {useState, useEffect} from 'react';
import '../App/App.css';
import './QueueView.css';
import Authentication from '../../util/Authentication/Authentication';

const QueueView = (props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  const JoinQueue = () => {
    authentication
        .makeCall('https://localhost:8081/queue/join', 'POST')
        .then((resp) => {
          resp.json().then((bodyData) => {
            twitch.rig.log(bodyData);

            if (resp.ok) {
              setButtonText('Leave the Queue');
              setButtonAction(() => LeaveQueue);
            }
          });
        });
  };

  const LeaveQueue = () => {
    authentication
        .makeCall('https://localhost:8081/queue/leave', 'POST')
        .then((resp) => {
          resp.json().then((bodyData) => {
            twitch.rig.log(bodyData);

            if (resp.ok) {
              setButtonAction(() => JoinQueue);
              setButtonText('Join the Queue');
            }
          });
        });
  };

  // state stuff
  const [ButtonText, setButtonText] = useState('Join the Queue');
  const [ButtonAction, setButtonAction] = useState(() => JoinQueue);
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Queue, setQueue] = useState([]);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);

  // make sure we authorize when the page loads.
  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!FinishedLoading) {
          twitch.listen('broadcast', (target, contentType, body) => {
            const queue = JSON.parse(body);

            setQueue(queue);
          });

          authentication
              .makeCall('https://localhost:8081/queue/get', 'GET')
              .then((resp) => {
                if (resp.ok) {
                  resp.json().then((bodyData) => {
                    const queue = bodyData.queue;

                    if (queue.includes(authentication.getOpaqueId())) {
                      setButtonText('Leave the Queue');
                      setButtonAction(() => LeaveQueue);
                    }

                    setQueue(queue);
                  });
                }
              });

          authentication
              .makeCall('https://localhost:8081/matchup/current/get')
              .then((resp) => {
                if (resp.ok) {
                  resp.json().then((resp) => {
                    setCurrentMatchup(resp.matchup);
                  });
                }
              });

          setFinishedLoading(true);
        }
      });
    }
  });

  const queueEntries = Queue.map(function(opaqueId, index) {
    return <li key={index}>{opaqueId}</li>;
  });

  let headerDiv = null;

  if (CurrentMatchup) {
    headerDiv = (
      <div className="Champion">
        Now Playing: 👑 {CurrentMatchup.champion} (27) v{' '}
        {CurrentMatchup.challenger}
      </div>
    );
  } else {
    headerDiv = <div className="Champion">👑 TMinz - 27 wins</div>;
  }

  return (
    <div className="QueueView">
      {headerDiv}
      <hr />
      <div className="Queue">
        <ol>{queueEntries}</ol>
      </div>
      <hr />
      <div className="Join">
        <button className="QueueButton" onClick={ButtonAction}>
          {ButtonText}
        </button>
      </div>
    </div>
  );
};

export default QueueView;
