import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import PropTypes from 'prop-types';
import Authentication from '../../util/Authentication/Authentication';
import QueueView from '../QueueView/QueueView';
import QueueNotification from '../QueueNotification/QueueNotification';
import { StyledQueuePanel } from './App.style';

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
    this.state = {
      finishedLoading: false,
      theme: 'dark',
      isVisible: true,
    };
  }

  /**
   * Called immediately after a component is mounted.
   * Setting state here will trigger re-rendering.
   *
   * Authorizes Twitch account and gathers context
   */
  componentDidMount() {
    this.twitch = window.Twitch ? window.Twitch.ext : null;

    if (this.twitch) {
      this.twitch.onAuthorized(async (auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          this.setState(() => ({ finishedLoading: true }));
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
   * Updates the Extension when the twitch viewer changes
   *
   * @param {object} context - twitch viewer settings
   * @param {string[]} delta - changed settings
   */
  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  /**
   * Sets when Visibilityt of extension changes
   *
   * @param {boolean} isVisible - Whether the extension is visible.
   */
  visibilityChanged(isVisible) {
    this.setState(() => ({
      isVisible,
    }));
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
          <div className="App-dark">
            <QueueNotification />
            <Tabs>
              <TabList>
                <Tab>QUEUE</Tab>
                <Tab>LEADERBOARD</Tab>
              </TabList>
              <StyledQueuePanel>
                <QueueView />
              </StyledQueuePanel>
              <TabPanel />
            </Tabs>
          </div>
        </div>
      );
    }
    return <div className="App" />;
  }
}

App.propTypes = {
  format: PropTypes.oneOf(['mobile', 'panel', 'component']).isRequired,
};
