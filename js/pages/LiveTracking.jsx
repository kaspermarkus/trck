'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskSelector from "../components/TaskSelector"
import moment from 'moment'

class LiveTracking extends React.Component {
  render () {
    if (this.props.initialState.currentTracking === undefined) {
      return <NewTracking initialState={this.props.initialState} onStartLiveTracking={this.props.onStartLiveTracking} />
    } else {
      return <ViewTracking onStopLiveTracking={this.props.onStopLiveTracking} getSystemState={this.props.getSystemState} />
    }
  }
}

class NewTracking extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      path: undefined,
      description: undefined
    }
    this.handleChange = this.handleChange.bind(this);
    this.startTracking = this.startTracking.bind(this);
  };

  startTracking () {
    this.setState({
      startTime: moment().valueOf()
    }, () => this.props.onStartLiveTracking(this.state));
  };

  handleChange (data) {
    this.setState(data);
  };

  render () {
    return (
      <div className="startTrackingArea container-fluid">
        <TaskSelector ref="taskSelector" onChange={this.handleChange} categoryData={this.props.initialState.categoryData} />
        <div className="row">
          <div className="col-sm-4 startButton button" onClick={this.startTracking}>
            Start
          </div>
        </div>
      </div>
    );
  }
};

class ViewTracking extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      time: "00:00:00"
    };
  };

  zeroPrefix (num) {
    return num < 10 ? "0" + num : num;
  };

  updateTimeSpent () {
    var diff = (Date.now() - this.props.getSystemState().currentTracking.startTime) / 1000;
    var hh = Math.floor(diff / 60 / 60);
    diff -= hh * 60 * 60;
    var mm = Math.floor(diff / 60);
    diff -= mm  * 60;
    var ss = Math.floor(diff);
    this.setState({
      time: this.zeroPrefix(hh) + ":" + this.zeroPrefix(mm) + ":" + this.zeroPrefix(ss)
    });
  };

  renderTaskHeader () {
    var header = this.props.getSystemState().currentTracking.path[1];
    if (header) {
      return <h2>{header}</h2>
    }
  };

  componentWillUnmount () {
      clearInterval(this.timer);
  };

  renderSubtaskHeader () {
    var header = this.props.getSystemState().currentTracking.path[2];
    if (header) {
      return <h3>{header}</h3>
    }
  };

  render () {
    if (!this.timer) {
      this.timer = setInterval(() => this.updateTimeSpent(), 1000)
    }
    return (
      <div className="viewLiveTrackingArea">
        <h1>{this.props.getSystemState().currentTracking.path[0]}</h1>
        {this.renderTaskHeader()}
        {this.renderSubtaskHeader()}
        <div className="description">{this.props.getSystemState().currentTracking.description}</div>
        <h1 className="timeCounter">{this.state.time}</h1>
        <div className="col-sm-4 stopButton button" onClick={() => (this.props.onStopLiveTracking())}>
          STOP
        </div>
      </div>
    );
  }
};

export default LiveTracking;