import Authentication from '../../../../util/Authentication/Authentication';
import React, {useState, useEffect, useRef} from 'react';
import Collapsible from 'react-collapsible';
import '../../../App/App.css';
import './QueueController.css';

/**
 * Component that shows your current position in queue,
 * then allows you to join / leave it, from the live config page.
 *
 * @param {*} props properties passed to the component.
 * @returns {Function} a cleanup function.
 */
const QueueController = (props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authProp = useRef(new Authentication());
  const authentication = authProp.current;

  // State stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [ButtonText, setButtonText] = useState('Loading...');
  const [ButtonAction, setButtonAction] = useState(() => {});
  const [Queue, setQueue] = useState([]);
  const [opaqueUserId, setOpaqueID] = useState(null);

  // helper functions
  /**
   * Fethches the current queue from the backend.
   */
  function fetchQueue() {
    console.log('fetching queue');

    authentication.makeCall('/queue/get', 'GET').then(function(resp) {
      if (resp.ok) {
        resp.json().then((bodyData) => {
          const queue = bodyData.queue;

          setQueue(queue);
        });
      }
    });
  }

  /**
   * Adds the User to the Queue
   */
  const JoinQueue = () => {
    authentication.makeCall('/queue/join', 'POST').then((resp) => {
      resp.json().then((bodyData) => {
        if (resp.ok) {
          setButtonText('Leave the Queue');
          setButtonAction(() => LeaveQueue);
        }
      });
    });
  };

  /**
   * Removes the User from the Queue
   */
  const LeaveQueue = () => {
    authentication.makeCall('/queue/leave', 'POST').then((resp) => {
      resp.json().then((bodyData) => {
        if (resp.ok) {
          setButtonAction(() => JoinQueue);
          setButtonText('Join the Queue');
        }
      });
    });
  };

  /**
   * Interfaces with the backend to remove someone from the queue.
   *
   * @param {*} opaqueUserId The user to remove from the queue.
   */
  const kickPlayer = (opaqueUserId) => {
    console.log(authentication);
    console.log('Kicking player ' + opaqueUserId);
    authentication
        .makeCall('/queue/kick', 'POST', {
          kickTarget: opaqueUserId,
        })
        .then((resp) => {
          if (!resp.ok) {
          // TODO: log error.
          }
        })
        .catch((err) => {
        // TODO: log error.
          console.log(err);
        });
  };

  /**
   * Custom Effect for QueueController
   * Handles Twitch authentication and pubsubs
   *
   * @returns {Function} closing function to stop listening to twitch broadcasts
   */
  const QueueEffect = () => {
    /**
     * Handles pubsub messages for 'updateQueue'
     *
     * @param {string} _target target
     * @param {string} _contentType content type
     * @param {object} body message body passed by twitch api.
     */
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);
      if (message.type == 'updateQueue') {
        setQueue(message.message);
      }
    }

    /**
     * Handles authorizing with twitch and running first time setup
     *
     * @param {object} auth - twitch authentication information
     */
    function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);
      setOpaqueID(authentication.getOpaqueId());

      if (!FinishedLoading) {
        firstTimeSetup();
        setFinishedLoading(true);
      }
    }

    /**
     * Sets the Users Opaque and User ID
     */
    function firstTimeSetup() {
      fetchQueue();

      console.log('running first time setup');
    }

    if (twitch) {
      twitch.onAuthorized(handleAuthentication);

      if (FinishedLoading) {
        twitch.onVisibilityChanged((isVisible, context) => {
          if (isVisible) {
            twitch.listen('broadcast', handleMessage);
          }
        });
      }
    }

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return function cleanup() {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
  };

  // Controls the join / leave button
  useEffect(() => {
    if (FinishedLoading) {
      if (
        Queue.findIndex(
            (challenger) => challenger.opaqueUserId == opaqueUserId,
        ) == -1
      ) {
        setButtonAction(() => JoinQueue);
        setButtonText('Join the Queue');
      } else {
        setButtonAction(() => LeaveQueue);
        setButtonText('Leave the Queue');
      }
    }
  }, [Queue]);

  // called when the component mounts.
  useEffect(QueueEffect, [Queue, FinishedLoading]);

  if (FinishedLoading) {
    const userEntry = Queue ?
      Queue.findIndex((challenger) => {
        return challenger.opaqueUserId == opaqueUserId;
      }) :
      -1;

    const queueEntries = Queue ?
      Queue.map((challenger, index) => {
        return (
          <li key={index}>
            {challenger.displayName}
            {authentication.isModerator() && (
              <a
                className="KickButton"
                style={{float: 'right'}}
                onClick={() => {
                  kickPlayer(challenger.opaqueUserId);
                }}
              >
                  &times;
              </a>
            )}
          </li>
        );
      }) :
      [];

    return (
      <div className="Well">
        <Collapsible
          trigger="QueueController"
          triggerClassName="DropdownTrigger"
          triggerOpenedClassName="DropdownTrigger--open"
          easing="ease-out"
          open={true}
          transitionTime={250}
        >
          <div>
            <span>
              {(userEntry == -1 && 'You\'re not currently in the queue.') ||
                `You are #${userEntry + 1} in the queue`}
            </span>

            {queueEntries && queueEntries.length > 0 && (
              <div>
                <ol>{queueEntries.slice(0, 5)}</ol>
              </div>
            )}

            <button className="DefaultButton" onClick={ButtonAction}>
              {ButtonText}
            </button>
          </div>
        </Collapsible>
      </div>
    );
  } else {
    return null;
  }
};

export default QueueController;
