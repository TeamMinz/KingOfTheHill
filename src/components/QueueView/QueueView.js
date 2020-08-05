import React from 'react';
import '../App/App.css';
import './QueueView.css'

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className='QueueView'>
      <div className="Champion">
      👑 TMinz - 27 wins
      </div>
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
      <div className='Join'>

      </div>
    </div>);
  }
}
