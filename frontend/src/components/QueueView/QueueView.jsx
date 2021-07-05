import React, { useState, useEffect, useRef } from "react";
import Authentication from "@util/Authentication/Authentication";
import QueueContext from "@util/QueueContext";
import MatchupView from "./components/MatchupView/MatchupView";
import QueueComponent from "./components/QueueComponent/QueueComponent";
import QueueController from "./components/QueueController/QueueController";
import ShopComponent from "./components/Overlays/ShopComponent";
import LeaderboardComponent from "./components/Overlays/LeaderboardComponent";
import { StyledQueueView } from "./QueueView.style";

/**
 * Component to Queue Tab
 *
 * @returns {string} html markup for view
 */
const QueueView = () => {
  // Twitch & Authentication stuff.
  const authProp = useRef(new Authentication());
  const authentication = authProp.current;

  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Queue, setQueue] = useState(null);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);
  const [CurrentChampion, setCurrentChampion] = useState(null);
  const [ShopState, setShopState] = useState({
    shopOpen: false,
    buttonX: 0,
    buttonY: 0,
  });
  const [LeaderboardState, setLeaderboardState] = useState({
    leaderboardOpen: false,
    buttonX: 0,
    buttonY: 0,
  });

  /**
   * Fetches a bunch of info from the backend,
   * and stores it for components to use.
   */
  const firstTimeSetup = () => {
    // Update the queue.
    authentication.makeCall("/queue/get", "GET").then((resp) => {
      if (resp.ok) {
        resp.json().then((queue) => {
          setQueue(queue);
        });
      }
    });

    // Update the current matchup.
    authentication.makeCall("/matchup/current/get").then((resp) => {
      if (resp.ok) {
        resp.json().then((jsonResp) => {
          setCurrentMatchup(jsonResp.matchup);
        });
      } else {
        console.warn("Failed to fetch current matchup");
      }
    });

    authentication.makeCall("/champion/get").then((resp) => {
      if (resp.ok) {
        resp.json().then((jsonResp) => {
          if (jsonResp) {
            setCurrentChampion(jsonResp);
          } else {
            setCurrentChampion(null);
          }
        });
      } else {
        console.warn("Failed to fetch current champion");
      }
    });
  };

  // Initialize authentication & twitch stuff.
  useEffect(() => {
    const twitch = window.Twitch ? window.Twitch.ext : null;
    if (twitch) {
      twitch.onError((err) => {
        console.error("Error", err);
      });

      // Authentication setup
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!FinishedLoading) {
          firstTimeSetup();

          setFinishedLoading(true);
        }
      });
    }
  });

  useEffect(() => {
    const twitch = window.Twitch ? window.Twitch.ext : null;
    /**
     * Handles pubsub messages
     *
     * @param {string} _target target
     * @param {string} _contentType content type
     * @param {object} body message body passed by twitch api.
     */
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);

      if (message.type === "updateQueue") {
        setQueue(message.message);
      } else if (message.type === "updateMatchup") {
        setCurrentMatchup(message.message);
      } else if (message.type === "updateChampion") {
        if (message.message) {
          setCurrentChampion(message.message);
        } else {
          setCurrentChampion(null);
        }
      }
    }

    if (FinishedLoading) {
      twitch.listen("broadcast", handleMessage);

      return function cleanup() {
        twitch.unlisten("broadcast", handleMessage);
      };
    }
    return false;
  }, [FinishedLoading]);

  return (
    <StyledQueueView>
      <QueueContext.Provider
        value={{
          queue: Queue,
          currentMatchup: CurrentMatchup,
          finishedLoading: FinishedLoading,
          currentChampion: CurrentChampion,
          shopState: ShopState,
          leaderboardState: LeaderboardState,
          setShopState,
          setLeaderboardState,
          auth: authentication,
        }}
      >
        <ShopComponent />
        <LeaderboardComponent />
        <MatchupView />
        <QueueComponent />
        <QueueController />
      </QueueContext.Provider>
    </StyledQueueView>
  );
};

export default QueueView;
