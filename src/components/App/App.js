import React from 'react';
import Authentication from '../../util/Authentication/Authentication';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import QueueView from '../QueueView/QueueView';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: 'dark',
      isVisible: true,
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return {theme: context.theme};
      });
    }
  }

  visibilityChanged(isVisible) {
    this.setState(() => {
      return {
        isVisible,
      };
    });
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          this.setState(() => {
            return {finishedLoading: true};
          });
        }
      });

      this.twitch.onVisibilityChanged((isVisible, _c) => {
        this.visibilityChanged(isVisible);
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });
    }
  }

  componentWillUnmount() {}

  render() {
    if (this.state.finishedLoading && this.state.isVisible) {
      return (
        <div className="App">
          <div
            className={this.state.theme === 'light' ? 'App-light' : 'App-dark'}
          >
            <Tabs>
              <TabList>
                <Tab>Queue</Tab>
                <Tab>Leaderboard</Tab>
              </TabList>
              <TabPanel className="queue">
                <QueueView />
              </TabPanel>
              <TabPanel></TabPanel>
            </Tabs>
          </div>
        </div>
      );
    } else {
      return <div className="App"></div>;
    }
  }
}
