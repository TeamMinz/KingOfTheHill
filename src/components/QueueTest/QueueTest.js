import React from 'react';
import Authentication from '../../util/Authentication/Authentication';

export default class QueueTest extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;

    this.state = {
      message: '',
      finishedLoading: false,
    };
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => {
            return {finishedLoading: true, message: ''};
          });
        }
      });
    }
  }

  joinQueue() {
    this.Authentication.makeCall(
        'https://localhost:8081/queue/join',
        'POST',
    ).then((resp) => {
      resp.json().then((body_data) => {
        this.setState({
          finishedLoading: true,
          message: body_data.message,
        });

        // this.twitch.rig.log(body_data);
      });
    });
  }

  leaveQueue() {
    this.Authentication.makeCall(
        'https://localhost:8081/queue/leave',
        'POST',
    ).then((resp) => {
      resp.json().then((body_data) => {
        this.setState({
          finishedLoading: true,
          message: body_data.message,
        });

        // this.twitch.rig.log(body_data);
      });
    });
  }

  render() {
    if (this.state.finishedLoading) {
      return (
        <div
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            fontSize: '750%',
          }}
        >
          <button
            onClick={this.joinQueue.bind(this)}
            style={{fontSize: '150%', width: '100%'}}
          >
            {' '}
            Join Queue{' '}
          </button>
          <button
            onClick={this.leaveQueue.bind(this)}
            style={{fontSize: '150%', width: '100%'}}
          >
            {' '}
            Leave Queue{' '}
          </button>

          <p style={{fontSize: '100%'}}>{this.state.message}</p>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
