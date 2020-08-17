import React, {useState} from 'react';

const QueueNotification = (props) => {
  const [IsVisible, setVisible] = useState(false);
  const [DisplayMessage, setMessage] = useState('');

  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!FinishedLoading) {
          twitch.listen('broadcast', (target, contentType, body) => {
            const message = JSON.parse(body);

            if (message.messageType == 'MESSAGE_YOUREUP') {
              setMessage(message.message);
              setVisible(true);
            }
          });
        }
      });

      if (IsVisible) {
        return <div>{DisplayMessage}</div>;
      } else {
        return;
      }
    }
  });
};

export default QueueNotification;
