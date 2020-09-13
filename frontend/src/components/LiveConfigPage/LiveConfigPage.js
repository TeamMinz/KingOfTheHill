import React, {useState, useEffect} from 'react';
import Authentication from '../../util/Authentication/Authentication';

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
  const authentication = new Authentication();

  // State stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Theme, setTheme] = useState('light');
  const [AutoRejoin, setAutoRejoin] = useState(false);
  const [Position, setPosition] = useState('');

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

      twitch.configuration.onChanged(() => {
        twitch.rig.log(
            `Anything: ${JSON.stringify(twitch.configuration.broadcaster)}`,
        );
        twitch.configuration.set(
            'broadcaster',
            '0.2',
            JSON.stringify({
              AutoRejoin: true,
              Position: 2,
            }),
        );
        if (twitch.configuration.broadcaster) {
          try {
            const config = JSON.parse(twitch.configuration.broadcaster.content);
            twitch.rig.log(config);
            if (typeof config === 'object') {
              setAutoRejoin(config.rejoin || false);
              setPosition(config.position || '');
            } else {
              console.log('invalid config');
            }
          } catch (e) {
            console.log('invalid config');
          }
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
        <RejoinController Position={Position} AutoRejoin={AutoRejoin} />
        <QueueController />
      </div>
    );
  } else {
    return <div className="LiveConfigPage"> Not authenticated yet</div>;
  }
};

export default LiveConfigPage;
