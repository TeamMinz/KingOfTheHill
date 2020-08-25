import React, {useState, useEffect} from 'react';
import NotificationSystem from 'react-notification-system';
import Authentication from '../../util/Authentication/Authentication';
import '../App/App.css';

const QueueNotification = (_props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();
  const notificationSystem = React.createRef();

  // state stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);

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
          return;
        }

        if (
          authentication.getOpaqueId() == matchup.challenger.opaqueUserId ||
          authentication.getOpaqueId() == matchup.champion.opaqueUserId
        ) {
          authentication
              .makeCall('https://localhost:8081/matchup/message/get')
              .then((resp) => resp.json())
              .then((json) => {
                addNotification(json.message);
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

  const addNotification = (message) => {
    const notification = notificationSystem.current;
    notification.addNotification({
      position: 'tc',
      message,
      level: 'success',
      autoDismiss: 0,
      dismissable: 'click',
    });
  };

  const style = {
    DefaultWidth: '75%',
    Containers: {
      tc: {
        top: '50%',
        left: '50%',
        msTransform: 'translate(-50%, -50%)',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '75%',
        padding: '0px',
        margin: '0px',
        marginLeft: '0px',
      },
    },
    NotificationItem: {
      // Override the notification item
      DefaultStyle: {
        // Applied to every notification, regardless of the notification level
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontWeight: 500,
        fontSize: '1rem',
        color: 'var(--text-color)',
        borderTop: '10px solid var(--border-color)',
        boxShadow: 'var(--border-color) 0px 0px 5px',
        background: 'var(--not-selected-color)',
      },
    },
  };

  return <NotificationSystem ref={notificationSystem} style={style} />;
};

export default QueueNotification;
