import React from 'react';
import Authentication from '../../util/Authentication/Authentication';

import './Config.module.css';

export default class ConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();
    this.state = {
      finishedLoading: false,
      theme: 'light',
    };
  }

  componentDidMount() {
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    // do config page setup as needed here
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // If the component hasn't finished loading
          // (as in we've not set up after getting a token)
          // let's set it up now.

          // Now we've done the setup for the component
          // let's set the state to true to force a rerender
          // with the correct data.
          this.setState(() => ({ finishedLoading: true }));
        }
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });
    }
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  render() {
    if (this.state.finishedLoading && this.Authentication.isModerator()) {
      return (
        <div className="Config">
          <div className={this.state.theme === 'light' ? 'Config-light' : 'Config-dark'}>
            There is no configuration needed for this extension!
          </div>
        </div>
      );
    }
    return (
      <div className="Config">
        <div className={this.state.theme === 'light' ? 'Config-light' : 'Config-dark'}>
          Loading...
        </div>
      </div>
    );
  }
}
