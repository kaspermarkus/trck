'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router'
import CategorySelect from "./CategorySelect"


export default React.createClass({
  getInitialState: function () {
    var initialVals = this.props.initialVals;
    return {
      path: initialVals && initialVals.path ? initialVals.path : [],
      description: initialVals && initialVals.description ? initialVals.description : ""
    }
  },

  getLevel: function (level) {
    if (level > this.state.path.length) {
      return {};
    }

    var obj = this.props.categoryData;
    for (var i = 0; i < level; i++) {
        obj = obj[this.state.path[i]];
    };
    return obj;
  },

  onSelectChange: function (level, value) {
    this.setState((prevState, props) => {
      var newPath;
      if (value === null) {
        newPath = prevState.path.slice(0, level);
      } else {
        newPath = prevState.path.slice(0, level+1);
        newPath[level] = value.label;
      }
      return {
        path: newPath
      }
    }, this.transmitChange);
  },

  changedDescription: function(event) {
    this.setState({
      description: event.target.value
    }, this.transmitChange);
  },

  getSelection: function () {
    return {
      path: this.state.path,
      description: this.state.description
    }
  },

  transmitChange () {
    this.props.onChange({
      path: this.state.path,
      description: this.state.description
    });
  },

  render: function () {
    return (
      <div className="taskSelectorArea container-fluid">
        <div className="row">
          <div className="formArea col-sm-8">
            <div className="container-fluid">
              <form id="startTrackingForm" className="form-horizontal">
                <label className="col-sm-3">Project:</label>
                <CategorySelect
                  className="col-sm-7"
                  options={this.getLevel(0)}
                  onChange={(evt) => {this.onSelectChange(0, evt)}}
                  value={this.state.path[0]}
                  name="project"
                />
                <label className="col-sm-3">Task:</label>
                <CategorySelect
                  className="col-sm-7"
                  options={this.getLevel(1)}
                  onChange={(evt) => (this.onSelectChange(1, evt))}
                  value={this.state.path[1]}
                  name="task"
                />
                <label className="col-sm-3">Subtask:</label>
                <CategorySelect
                  className="col-sm-7"
                  onChange={(evt) => (this.onSelectChange(2, evt))}
                  options={this.getLevel(2)}
                  value={this.state.path[2]}

                  name="subtask"
                />
                <div className="form-group">
                  <label className="col-sm-3">Description:</label>
                  <textarea id="descriptionArea" className="col-sm-7" defaultValue={this.state.description} onChange={this.changedDescription}></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});