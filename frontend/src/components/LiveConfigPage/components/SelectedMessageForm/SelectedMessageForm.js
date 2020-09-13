import Authentication from '../../../../util/Authentication/Authentication';
import React, {useState, useEffect} from 'react';
import Collapsible from 'react-collapsible';
import '../../LiveConfigPage.css';
import './SelectedMessageForm.css';

/**
 * Component that displays an error.
 *
 * @param {{showError: boolean}} options whether the error should be shown.
 * @returns {object} the react component to be rendered.
 */
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

/**
 * Component that allows you to set a 'you're up!' message.
 *
 * @param {*} props properties passed to the component.
 * @returns {Function} a cleanup function.
 */
const SelectedMessageForm = (props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  // State stuff.
  const [ShowError, setShowError] = useState(false);
  const [SelectionMessage, setSelectionMessage] = useState('Loading...');
  const [FinishedLoading, setFinishedLoading] = useState(false);

  /**
   * Called when the selection message should be updated.
   *
   * @param {*} event event containing the message.
   */
  const updateSelectionMessage = (event) => {
    event.preventDefault();

    if (FinishedLoading) {
      authentication
          .makeCall('/matchup/message/set', 'POST', {message: SelectionMessage})
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

  /**
   * Stores selection message.
   *
   * @param {*} event the event with the selection message.
   */
  const storeSelectionMessage = (event) => {
    setSelectionMessage(event.target.value);
  };

  useEffect(() => {
    /**
     * @param {object} auth auth object passed by twitch.
     */
    function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        authentication.makeCall('/matchup/message/get').then((resp) => {
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
      <div className="Well">
        <Collapsible
          trigger="Selection Message"
          triggerClassName="DropdownTrigger"
          triggerOpenedClassName="DropdownTrigger--open"
          easing="ease-out"
          open={true}
          transitionTime={250}
        >
          <form
            method="POST"
            className={'SelectedMessageForm'}
            onSubmit={updateSelectionMessage}
          >
            <ErrorMessage showError={ShowError} />
            <textarea
              className="MessageTextBox"
              type="text"
              name="message"
              rows="5"
              cols="30"
              defaultValue={SelectionMessage}
              onChange={storeSelectionMessage}
            />
            <input
              className="DefaultButton"
              type="submit"
              value="Update Message"
            ></input>
          </form>
        </Collapsible>
      </div>
    );
  } else {
    return null;
  }
};

export default SelectedMessageForm;
