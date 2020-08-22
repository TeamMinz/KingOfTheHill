import React, {useState, useEffect} from 'react';
import Authentication from '../../util/Authentication/Authentication';
import './QueueNotification.css';

const QueueNotification = (_props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  // state stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [IsVisible, setVisible] = useState(false);
  const [DisplayMessage, setMessage] = useState('');

  useEffect(() => {
    /**
     * @param _target
     * @param _contentType
     * @param body
     */
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);
      if (message.type == 'updateMatchup') {
        const matchup = message.message;
        if (matchup == null) {
          setVisible(false);
          return;
        }

        if (
          authentication.getOpaqueId() == matchup.challenger.opaqueUserId ||
          authentication.getOpaqueId() == matchup.champion.opaqueUserId
        ) {
          authentication
              .makeCall('https://localhost:8081/matchup/message/get')
              .then((resp) => (resp.json()))
              .then((json) => {
                setMessage(json.message);
                setVisible(true);
              });
        }
      }
    }

    /**
     * @param auth auth information passed by twitch
     */
    function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        setFinishedLoading(true);
      }
    }

    if (twitch) {
      twitch.onAuthorized(handleAuthentication);
    }

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return function cleanup() {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
  });

  if (IsVisible) {
    return (
      <div className="QueueNotification">
        <div className="MessageBox">{DisplayMessage}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default QueueNotification;
