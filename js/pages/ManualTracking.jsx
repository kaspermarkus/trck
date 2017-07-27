'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskSelector from "../components/TaskSelector"
import TaskTimeSelector from "../components/TaskTimeSelector"


class ManualTracking extends React.Component {
  constructor (props) {
    super(props);
    var initialVals = this.props.initialState.manualRecord;
    this.state = initialVals;
    this.handleChange = this.handleChange.bind(this);
    this.recordManualTracking = this.recordManualTracking.bind(this);
    this.cancelManualTracking = this.cancelManualTracking.bind(this);
  };

  recordManualTracking () {
    console.log("record Manual")
    this.props.recordManualTracking(this.state, this.state.recordId);
  };

  handleChange (data) {
    this.setState(data, () => {
      this.props.onManualTrackingChange(this.state, this.state.recordId);
    });
  };

  isEditing () {
    return this.state && this.state.recordId;
  };

  getTitle () {
    return this.isEditing() ? "Edit Record" : "Add Record";
  };

  cancelManualTracking () {
    if (this.isEditing()) {
      this.props.onCancelManualTracking();
    }
  };

  render () {
    return (
      <div className="manualTrackingArea container-fluid">
        <h1>{this.getTitle()}</h1>
        <TaskSelector onChange={this.handleChange} initialVals={this.state} categoryData={this.props.initialState.categoryData} />
        <TaskTimeSelector ref="taskTimeSelector" initialVals={this.state} onChange={this.handleChange} />
        <div className="row">
          <div className="col-sm-4 saveButton button" onClick={this.recordManualTracking}>
            {this.isEditing() ? "Save Changes" : "Create Record" }
          </div>

          {(this.isEditing()) ?
            <div className="col-sm-4 cancelButton button" onClick={this.cancelManualTracking}>Cancel</div>
            : ""}
        </div>
      </div>
    );
  }
};

export default ManualTracking;