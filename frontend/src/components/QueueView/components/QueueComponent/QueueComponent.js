import React, {useState, useEffect, useContext} from 'react';
import QueueContext from '../../../../util/QueueContext';
import '../../../App/App.css';
import './QueueComponent.css';

/**
 * @param {any} _props properties passed to this component
 *
 * @returns {any} the jsx to render.
 */
const QueueComponent = (_props) => {
  const ctx = useContext(QueueContext);

  // state stuff
  const [ButtonText, setButtonText] = useState('Loading...');
  const [ButtonAction, setButtonAction] = useState(() => {});

  // helper functions

  /**
   * Interfaces with the backend to remove someone from the queue.
   *
   * @param {*} opaqueUserId The user to remove from the queue.
   */
  const kickPlayer = (opaqueUserId) => {
    // console.log(authentication);
    console.log('Kicking player ' + opaqueUserId);
    ctx.auth
        .makeCall('/queue/kick', 'POST', {
          kickTarget: opaqueUserId,
        })
        .then((resp) => {
          if (!resp.ok) {
          // TODO: log error.
            console.log('Kick failed');
          } else {
            console.log('kick successful');
          }
        })
        .catch((err) => {
        // TODO: log error.
          console.log(err);
        });
  };

  /**
   * Adds the User to the Queue
   */
  const joinQueue = () => {
    ctx.auth.makeCall('/queue/join', 'POST').then((resp) => {
      resp.json().then((bodyData) => {
        if (resp.ok) {
          setButtonText('Leave the Queue');
          setButtonAction(() => leaveQueue);
        }
      });
    });
  };

  /**
   * Removes the User from the Queue
   */
  const leaveQueue = () => {
    ctx.auth.makeCall('/queue/leave', 'POST').then((resp) => {
      resp.json().then((bodyData) => {
        if (resp.ok) {
          setButtonAction(() => joinQueue);
          setButtonText('Join the Queue');
        }
      });
    });
  };

  // called when the component mounts.

  // Controls the join / leave button
  useEffect(() => {
    if (ctx.finishedLoading && ctx.queue) {
      if (
        ctx.queue.queue.findIndex(
            (challenger) =>
              challenger.opaqueUserId == ctx.auth.getOpaqueId(),
        ) == -1
      ) {
        setButtonAction(() => joinQueue);
        setButtonText('Join the Queue');
      } else {
        setButtonAction(() => leaveQueue);
        setButtonText('Leave the Queue');
      }
    }
  }, [ctx.queue]);

  // console.log(authentication);

  /**
   * Creates the li element for each queue member
   *
   * @param {any} challenger challenger to render.
   * @param {number} index index of challenger.
   * @returns {any} rendered html.
   */
  const createUserEntry = (challenger, index) => {
    return (
      <li key={index}>
        {challenger.displayName}
        {ctx.auth.isModerator() && (
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
  };

  const queueEntries = ctx.queue ? ctx.queue.queue.map(createUserEntry) : [];

  const userEntry = ctx.queue ?
    ctx.queue.queue.findIndex((challenger) => {
      return challenger.opaqueUserId == ctx.auth.getOpaqueId();
    }) :
    -1;

  if (queueEntries.length > 0 &&
      ctx.currentChampion &&
      ctx.queue.queue[0].opaqueUserId ==
      ctx.currentChampion.user.opaqueUserId) {
    queueEntries.shift();
  }

  return (
    <div className="QueueComponent">
      <div className="Queue">
        {queueEntries && queueEntries.length > 0 && (
          <div>
            <ol>{queueEntries.slice(0, 5)}</ol>
            {userEntry > 4 && (
              <div>
                ...
                <br />
                <ol start={userEntry + 1}>
                  {createUserEntry(ctx.queue.queue[userEntry], userEntry)}
                </ol>
              </div>
            )}
            {userEntry <= 4 && ctx.queue.queue.length > 5 && (
              <div>
                ...
                <br />
                <ol start={ctx.queue.queue.length}>
                  {createUserEntry(ctx.queue.queue[ctx.queue.queue.length - 1],
                      ctx.queue.queue.length - 1)}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="Join">
        <button
          className="QueueButton"
          onClick={ButtonAction}
          disabled={!ctx.auth.getUserId() || !(ctx.queue && ctx.queue.isOpen)}
        >
          {ButtonText}
        </button>
      </div>
    </div>
  );
};

export default QueueComponent;
