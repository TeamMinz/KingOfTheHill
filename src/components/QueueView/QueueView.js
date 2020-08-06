import React, { useState } from "react";
import "../App/App.css";
import "./QueueView.css";

const QueueView = (props) => {

  const JoinQueue = () => {
    setButtonText("Leave the Queue");
    setButtonAction(() => LeaveQueue);
  };

  const LeaveQueue = () => {
    setButtonAction(() => JoinQueue);
    setButtonText("Join the Queue");
  };

  const [ButtonText, setButtonText] = useState("Join the Queue");
  const [ButtonAction, setButtonAction] = useState(() => JoinQueue);

  return (
    <div className="QueueView">
      <div className="Champion">👑 TMinz - 27 wins</div>
      <hr />
      <div className="Queue">
        <ol>
          <li>Test1</li>
          <li>Test2</li>
          <li>Test3</li>
          <li>Test4</li>
          <li>Test4</li>
          <li>Test4</li>
          <li>Test4</li>
          <li>Test4</li>
          <li>Test4</li>
          <li>Test4</li>
          <li>Test4</li>
          <li>Test4</li>
          <li>Test4</li>
        </ol>
      </div>
      <hr />
      <div className="Join">
        <button className="QueueButton" onClick={ButtonAction}>
          {ButtonText}
        </button>
      </div>
    </div>
  );
};

export default QueueView;

/*import React, { useState } from "react";
import "../App/App.css";
import "./QueueView.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.button = {text: "Join the Queue", handler: this.joinQueue.bind(this)};
  }

  joinQueue() {
    //TODO: actually join the queue.

    this.setState({button: {
      text: "Leave the Queue",
      handler: this.leaveQueue
    }});
  }

  leaveQueue() {
    //TODO: actually join the queue.

    this.setState({button: {
      text: "Join the Queue",
      handler: this.joinQueue
    }});
  }

  render() {
    return (
      <div className="QueueView">
        <div className="Champion">👑 TMinz - 27 wins</div>
        <hr/>
        <div className="Queue">
          <ol>
            <li>Test1</li>
            <li>Test2</li>
            <li>Test3</li>
            <li>Test4</li>
            <li>Test4</li>
            <li>Test4</li>
            <li>Test4</li>
            <li>Test4</li>
            <li>Test4</li>
            <li>Test4</li>
            <li>Test4</li>
            <li>Test4</li>
            <li>Test4</li>
          </ol>
        </div>
        <hr/>
        <div className="Join">
          <button className="QueueButton" onClick={this.state.button.handler.bind(this)}>{this.state.button.text}</button>
        </div>
      </div>
    );
  }
}*/
