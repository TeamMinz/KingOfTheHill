import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Authentication from '../../util/Authentication/Authentication';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

/**
 * Handles all notifications
 * Mainly 'Currently Up' Messages
 * Also notifications for extra permissions
 *
 * @returns {string} html markup for notifications
 */
const QueueNotification = () => {
  const authentication = new Authentication();

  // state stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  /**
   * Gets Notification message from server
   *
   * @param {object} matchup - Current matchup
   */
  const fetchMessage = (matchup) => {
    if (
      matchup
      && (authentication.getOpaqueId() === matchup.challenger.opaqueUserId
        || authentication.getOpaqueId() === matchup.champion.opaqueUserId)
    ) {
      authentication.makeCall('/matchup/message/get').then((resp) => {
        if (resp.ok) {
          resp.json().then((jsonResp) => {
            setMessage(jsonResp.message);
            openModal();
          });
        }
      });
    }
  };

  /**
   * Gets Current Matchup from server
   */
  const fetchMatchup = () => {
    authentication.makeCall('/matchup/current/get').then((resp) => {
      if (resp.ok) {
        resp.json().then((jsonResp) => {
          fetchMessage(jsonResp.matchup);
        });
      }
    });
  };

  /**
   * Checks if the User has granted the proper permissions
   *
   * @returns {boolean} Whether extension has proper permissions
   */
  const checkUserPermission = (twitch) => {
    if (authentication.getUserId()) {
      return true;
    }
    twitch.actions.requestIdShare();
    return false;
  };

  /**
   * Custom Effect for QueuNotification
   * Handles Twitch authentication and pubsubs
   *
   * @returns {Function} closing function to stop listening to twitch broadcasts
   */
  const NotificationEffect = () => {
    const twitch = window.Twitch ? window.Twitch.ext : null;
    /**
     * Handles pubsub messages for 'updateMatchup'
     *
     * @param {string} _target target
     * @param {string} _contentType content type
     * @param {object} body message body passed by twitch api.
     */
    const handleMessage = (_target, _contentType, body) => {
      const pubsub = JSON.parse(body);
      if (pubsub.type === 'updateMatchup') {
        const matchup = pubsub.message;
        if (matchup == null) {
          closeModal();
          return;
        }

        fetchMessage(matchup);
      }
    };

    /**
     * Handles authorizing with twitch and running first time setup
     *
     * @param {object} auth auth information passed by twitch
     */
    const handleAuthentication = (auth) => {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        if (checkUserPermission(twitch)) {
          fetchMatchup();
        }
        setFinishedLoading(true);
      }
    };

    if (twitch) {
      twitch.onAuthorized(handleAuthentication);
      twitch.onVisibilityChanged((isVisible) => {
        if (isVisible) {
          twitch.listen('broadcast', handleMessage);
        }
      });
    }

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return function cleanup() {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
    return false;
  };
  // called when the component mounts.
  useEffect(NotificationEffect, [FinishedLoading]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h2>{message}</h2>
      <button onClick={closeModal} type="button">
        close
      </button>
    </Modal>
  );
};

export default QueueNotification;
