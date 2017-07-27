'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

import DatePicker from 'react-datepicker'
import TimePicker from 'rc-time-picker'
import moment from 'moment'

class TaskTimeSelector extends React.Component {
  constructor (props) {
    super(props);
    var initialVals = this.props.initialVals || {};
    this.state = {
      date: initialVals.startTime ? moment(initialVals.startTime) : moment(),
      startTime: initialVals.startTime ? moment(initialVals.startTime) :  moment(),
      endTime: initialVals.endTime ? moment(initialVals.endTime) : moment().add(45, 'minutes')
    };
    this.transmitChange();
  };

  transmitChange () {
    var startTime = moment(this.state.date).hour(this.state.startTime.hour()).minutes(this.state.startTime.minutes());
    var endTime = moment(this.state.date).hour(this.state.endTime.hour()).minutes(this.state.endTime.minutes());

    this.props.onChange({
      startTime: startTime,
      endTime: endTime
    });
  };

  updateState (data) {
    this.setState(data, this.transmitChange);
  };

  render () {
    return (
      <div className="taskTimeSelectorArea container-fluid">
        <div className="row">
          <div className="formArea col-sm-8">
            <div className="container-fluid">
              <form id="taskTimeSelectorForm" className="form-horizontal">
                <div className="row">
                  <label className="col-sm-3">Date:</label>
                  <DatePicker
                    selected={this.state.date}
                    onChange={(newDate) => this.updateState({date: newDate})}
                    todayButton="Today"
                    dateFormat="DD/MM/YYYY"
                  />
                </div>
                <div className="row">
                  <label className="col-sm-3">Start Time:</label>
                  <TimePicker
                    defaultValue={this.state.startTime}
                    showSecond={false}
                    onChange={(newStart) => this.updateState({startTime: newStart})}
                  />
                </div>
                <div className="row">
                  <label className="col-sm-3">End Time:</label>
                  <TimePicker
                    defaultValue={this.state.endTime}
                    showSecond={false}
                    onChange={(newEnd) => this.updateState({endTime: newEnd})}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default TaskTimeSelector;
