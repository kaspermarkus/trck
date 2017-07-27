'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router'
import { remote } from 'electron';
import fs from 'fs';

import moment from 'moment'
import Tab from "../components/Tab";

export default React.createClass({
  filePath: remote.app.getPath("userData") + "/data.json",

  getInitialState: function () {
    var data = this.load();
    data.currentTab === data.currentTab || "live";
    return data;
  },

  startLiveTracking: function (data) {
    // mark it in console
    console.log("Start Tracking: ", data);
    // update state
    this.setState({
      currentTracking: data
    }, function () {
      this.save();
      hashHistory.push("/liveTracking");
    });
  },

  stopLiveTracking: function () {
    this.recordWork(this.state.currentTracking, { currentTracking: undefined });
  },

  recordManualTracking: function (data, recordId) {
    data.recordId = recordId;
    this.recordWork(data, { manualRecord: undefined });
  },

  handleManualTrackingChange: function (data, recordId) {
    data.recordId = recordId;
    this.setState({
      manualRecord: data
    }, this.save);
  },

  recordWork: function (data, extraStateChanges) {
    var recordId = data.recordId ? data.recordId : data.startTime.valueOf();
    var endTime = data.endTime ? data.endTime.valueOf() : moment().valueOf();
    var newState = extraStateChanges || {};
    this.setState((prevState) => {
      prevState.records[recordId] = {
        path: data.path,
        description: data.description,
        startTime: data.startTime.valueOf(),
        endTime: endTime
      };

      newState["records"] = prevState.records;
      return newState;
    }, () => {
      this.save();
      this.switchTab("list");
    });
  },

  switchTab: function (name) {
    this.setState({
      currentTab: name
    });
    hashHistory.push("/"+name);
  },

  editRecord: function (index) {
    console.log("edit: ", index)
    var rec = this.state.records[index];
    this.setState({
      manualRecord: {
        recordId: index,
        path: rec.path,
        description: rec.description,
        startTime: rec.startTime,
        endTime: rec.endTime
      }
    }, () => {
      this.save();
      this.switchTab("manual");
    });
  },


  save: function () {
    fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2));
  },

  defaultCategoryData: {
    "Raising the Floor": {
      "Meetings": {},
      "Coding": {},
      "Mail": {}
    },
    "Havsans": {
      "Del 1": {
        "Del.1.1": {}
      },
      "Del 2": {
        "Del.2.1": {}
      }
    },
    "Metanance": {
      "Kars": {},
      "Vikar App": {}
    }
  },

  load: function () {
    var data;
    try {
      data = JSON.parse(fs.readFileSync(this.filePath));
    } catch (err) {
      if (err.code === 'ENOENT') {
        data = {
          categoryData: this.defaultCategoryData,
          records: {}
        }
      } else {
        throw err;
      }
    }

    return data;
  },

  cancelManualTracking: function (tmp) {
    this.setState({
      manualRecord: undefined
    }, () => this.switchTab("list"));
  },

  render: function() {
    var children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        onStartLiveTracking: this.startLiveTracking,
        onStopLiveTracking: this.stopLiveTracking,
        recordManualTracking: this.recordManualTracking,
        editRecord: this.editRecord,
        initialState: this.state,
        onCancelManualTracking: this.cancelManualTracking,
        onManualTrackingChange: this.handleManualTrackingChange,
        getSystemState: () => (this.state)
      })
    })

    return (
      <div>
        <div className="tabsArea">
          <Tab currentTab={this.state.currentTab} glyphicon="edit" tabName="manual" onClick={this.switchTab} />
          <Tab currentTab={this.state.currentTab} glyphicon="time" tabName="live" onClick={this.switchTab} />
          <Tab currentTab={this.state.currentTab} glyphicon="list" tabName="list" onClick={this.switchTab} />
          <div className="restTabArea" />
        </div>
        <div id="mainArea">{children}</div>
      </div>
    )
  }
});