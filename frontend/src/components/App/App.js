import React from 'react';
import Authentication from '../../util/Authentication/Authentication';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import PropTypes from 'prop-types';
import QueueView from '../QueueView/QueueView';
import QueueNotification from '../QueueNotification/QueueNotification';
import './App.scss';

/**
 * Base class for the React App. Sets up the scene
 */
export default class App extends React.Component {
  /**
   * @param {object} props - components
   */
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    // if the extension is running on twitch or dev rig,
    // set the shorthand here. otherwise, set to null.

    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: 'dark',
      isVisible: true,
    };
  }

  /**
   * Updates the Extension when the twitch viewer changes
   *
   * @param {object} context - twitch viewer settings
   * @param {string[]} delta - changed settings
   */
  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return {theme: context.theme};
      });
    }
  }

  /**
   * Sets when Visibilityt of extension changes
   *
   * @param {boolean} isVisible - Whether the extension is visible.
   */
  visibilityChanged(isVisible) {
    this.setState(() => {
      return {
        isVisible,
      };
    });
  }

  /**
   * Called immediately after a component is mounted.
   * Setting state here will trigger re-rendering.
   *
   * Authorizes Twitch account and gathers context
   */
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

  /**
   * Renders the Extension
   *
   * @returns {string} HTML markup for the base extension
   */
  render() {
    if (this.state.finishedLoading && this.state.isVisible) {
      return (
        <div className={`App ${this.props.format}`}>
          <div
            className={/*this.state.theme === 'light' ? 'App-light' :*/ 'App-dark'}
          >
            <QueueNotification />
            <Tabs>
              <TabList>
                <Tab>QUEUE</Tab>
                <Tab>LEADERBOARD</Tab>
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

App.propTypes = {
  format: PropTypes.oneOf(['mobile', 'panel', 'component']),
};
