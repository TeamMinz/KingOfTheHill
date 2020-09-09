import React, {useState, useEffect} from 'react';
import Authentication from '../../util/Authentication/Authentication';
import SelectedMessageForm from '../SelectedMessageForm/SelectedMessageForm.js';
import MatchupController from '../MatchupController/MatchupController.js';

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
  const authentication = new Authentication();

  // State stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Theme, setTheme] = useState('light');

  // Initialize authentication & twitch stuff.
  useEffect(() => {
    if (twitch) {
      // Authentication setup
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
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
        className={
          Theme === 'light' ?
            'LiveConfigPage-light' :
            'LiveConfigPage-dark'
        }
      >
        <SelectedMessageForm />
        <MatchupController />
      </div>
    );
  } else {
    return <div className="LiveConfigPage"> Not authenticated yet</div>;
  }
};

export default LiveConfigPage;
