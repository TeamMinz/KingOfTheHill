import Authentication from '../../util/Authentication/Authentication';
import React, {useState, useEffect} from 'react';
import './SelectedMessageForm.css';

const ErrorMessage = ({showError}) => {
  if (showError) {
    return (
      <p>
        An error has occoured trying to set the message. Please try again later.
      </p>
    );
  } else {
    return null;
  }
};

const SelectedMessageForm = (props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  // State stuff.
  const [ShowError, setShowError] = useState(false);
  const [SelectionMessage, setSelectionMessage] = useState('Loading...');
  const [FinishedLoading, setFinishedLoading] = useState(false);

  const updateSelectionMessage = (event) => {
    event.preventDefault();

    if (FinishedLoading) {
      authentication
          .makeCall(
              '/matchup/message/set',
              'POST',
              {message: SelectionMessage},
          )
          .then((resp) => {
            if (resp.ok) {
              resp.json().then((json) => {
                setSelectionMessage(json.message);
              });
            } else {
              setShowError(true);
            }
          });
    }
  };

  const storeSelectionMessage = (event) => {
    setSelectionMessage(event.target.value);
  };

  useEffect(() => {
    /**
     * @param auth
     */
    function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        authentication
            .makeCall('/matchup/message/get')
            .then((resp) => {
              if (resp.ok) {
                resp.json().then((json) => {
                  setSelectionMessage(json.message);
                  setFinishedLoading(true);
                });
              }
            });
      }
    }

    if (twitch) {
      twitch.onAuthorized(handleAuthentication);
    }
  });

  if (FinishedLoading) {
    return (
      <form
        method="POST"
        className="SelectedMessageForm"
        onSubmit={updateSelectionMessage}
      >
        <ErrorMessage showError={ShowError} />

        <label htmlFor="message">Set your selection message:</label>

        <textarea
          type="text"
          name="message"
          rows="5"
          cols="30"
          defaultValue={SelectionMessage}
          onChange={storeSelectionMessage}
        />
        <br />
        <input type="submit" value="Update Message"></input>
      </form>
    );
  } else {
    return null;
  }
};

export default SelectedMessageForm;
