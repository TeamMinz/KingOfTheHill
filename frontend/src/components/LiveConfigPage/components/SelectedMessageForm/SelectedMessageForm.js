import React, {useState, useContext, useEffect} from 'react';
import Collapsible from 'react-collapsible';
import QueueContext from '../../../../util/QueueContext';
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
  const ctx = useContext(QueueContext);

  // State stuff.
  const [ShowError, setShowError] = useState(false);
  const [SelectionMessage, setSelectionMessage] = useState(null);

  /**
   * Called when the selection message should be updated.
   *
   * @param {*} event event containing the message.
   */
  const updateSelectionMessage = (event) => {
    event.preventDefault();

    if (ctx.finishedLoading) {
      ctx.auth
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

  // runs once when twitch api loads.
  useEffect(() => {
    if (ctx.finishedLoading) {
      ctx.auth.makeCall('/matchup/message/get').then((resp) => {
        resp.json().then((message) => {
          setSelectionMessage(message.message);
        });
      });
    }
  }, [ctx.finishedLoading]);

  if (ctx.finishedLoading && SelectionMessage) {
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
