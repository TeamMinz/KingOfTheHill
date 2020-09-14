import React, {useState, useEffect} from 'react';

// eslint-disable-next-line max-len
import SelectedMessageForm from './components/SelectedMessageForm/SelectedMessageForm';
// eslint-disable-next-line max-len
import MatchupController from './components/MatchupController/MatchupController';
import QueueController from './components/QueueController/QueueController';
import RejoinController from './components/RejoinController/RejoinController';

import '../App/App.css';
import './LiveConfigPage.css';

/**
 * Live config page react hook.
 *
 * @param {*} props properties of the live config page.
 * @returns {any} the html to be rendered.
 */
const LiveConfigPage = (props) => {
  // Twitch & Authentication stuff.
  const twitch = window.Twitch ? window.Twitch.ext : null;

  // State stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Theme, setTheme] = useState('light');

  // Initialize authentication & twitch stuff.
  useEffect(() => {
    if (twitch) {
      twitch.onError((err) => {
        console.log('Error', err);
      });

      // Authentication setup
      twitch.onAuthorized((auth) => {
        if (!FinishedLoading) {
          setFinishedLoading(true);
        }
      });

      // Handle light / dark mode
      twitch.onContext((context, delta) => {
        if (delta.includes('theme')) {
          setTheme(context.theme);
        }
      });
    }
  });

  if (FinishedLoading) {
    return (
      <div
        // eslint-disable-next-line max-len
        className={`LiveConfigPage ${
          Theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'
        }`}
      >
        <SelectedMessageForm />
        <MatchupController />
        <RejoinController />
        <QueueController />
      </div>
    );
  } else {
    return <div className="LiveConfigPage"> Not authenticated yet</div>;
  }
};

export default LiveConfigPage;
