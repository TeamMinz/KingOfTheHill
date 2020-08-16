import React, {useState} from 'react';
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
  // State stuff.
  const [ShowError, setShowError] = useState(false);
  const [SelectionMessage, setSelectionMessage] = useState(
      'You\'re up! Join arena (ARENA CODE) with password (PASSWORD).',
  );

  const updateSelectionMessage = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    fetch('/updatemessage', {
      method: 'POST',
      body: formData,
    }).then(
        (resp) => {
          if (resp.ok) {
            setSelectionMessage(resp.selectionMessage);
          } else {
            setShowError(true);
          }
        },
        (err) => {
          setShowError(true);
        },
    );
  };

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
      />
      <br />
      <input type="submit" value="Update Message"></input>
    </form>
  );
};

export default SelectedMessageForm;
