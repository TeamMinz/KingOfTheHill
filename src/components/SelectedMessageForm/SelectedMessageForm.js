import React from 'react'

import './SelectedMessageForm.css'

function ErrorMessage({showError}) {

  window.Twitch.ext.rig.log(showError);

  if (showError) {
    return (<p>An error has occoured trying to set the message. Please try again later.</p>);
  } else {
    return null;
  }
}

export default class SelectedMessageForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          selectionMessage: "You're up! Join arena (ARENA CODE) with password (PASSWORD).",
          showError: false
        };
    }

    showErrorMessage() {
      this.setState(
        {
          selectionMessage: this.state.selectionMessage,
          showError: true,
        }
      )
    }

    updateSelectionMessage(event) {
      event.preventDefault();

      let formData = new FormData(event.target);

      fetch('/updatemessage', {
        method: 'POST',
        body: formData
      }).then(resp => {

        if (resp.ok) {
          this.setState({
            selectionMessage: resp.selectionMessage,
            showError: false,
          });
        } else {
          this.showErrorMessage();
        }        
      }, err => {
        this.showErrorMessage();
      });
    }


    render() {
        return (
        <form method="POST" onSubmit={this.updateSelectionMessage}>

          <ErrorMessage showError={this.state.showError}/>

          <label for="message">
            Set your selection message:
          </label>

          <textarea type="text" name="message">
          {this.state.selectionMessage}
          </textarea>
          <br />
          <input type="submit" value="Update Message"></input>
        </form>
        );
    }
}