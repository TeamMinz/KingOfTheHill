import React from 'react'

import './SelectedMessageForm.css'

export default class SelectedMessageForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <form method="POST">

          <label for="message">
            Set your selection message:
          </label>

          <textarea type="text" name="message">
          You're up! Connect to (lobby code), with (password).
          </textarea>
          <br />
          <input type="submit" value="Update Message"></input>
        </form>
        );
    }
}