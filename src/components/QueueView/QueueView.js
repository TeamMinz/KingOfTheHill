import React from "react";
import "../App/App.css";
import "./QueueView.css";

const JoinQueue = () => {
  setButtonAction(LeaveQueue);
  setButtonText("Leave the Queue");

}

const LeaveQueue = () => {
  setButtonAction(JoinQueue);
  setButtonText("Join the Queue");
  
}

const [ButtonText, setButtonText] = useState("Join the Queue");
const [ButtonAction, setButtonAction] = useState(JoinQueue);

export default class App extends React.Component {
  constructor(props) {
    super(props);
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
          <button className="QueueButton" onclick={JoinQueue}>Join the Queue</button>
        </div>
      </div>
    );
  }
}
