'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router'
import { remote } from 'electron';
import fs from 'fs';
import {ipcRenderer} from 'electron';
import {nativeImage} from 'electron';
import utils from '../Utils'
// var canvasBuffer = require('electron-canvas-to-buffer')

import moment from 'moment'
import Tab from "../components/Tab";

export default React.createClass({
  filePath: remote.app.getPath("userData") + "/data.json",
  timer: null,

  getInitialState: function () {
    var data = this.load();
    data.currentTab === data.currentTab || "live";
    if (data.currentTracking) {
      this.timer = setInterval(() => this.liveTick(), 1000);
    }
    return data;
  },

  liveTick: function () {
    var timeSpent = utils.timeSpent(this.state.currentTracking.startTime, moment().valueOf());
    console.log("Updating : " + timeSpent);
    this.updateLiveTab(this.state.currentTracking.path[0] + ": " + timeSpent);
  },

  updateLiveTab: function (text) {
    console.log("updating live tab with: " + text);
    this.setState({
      liveTabText: text
    });
  },

  // updateTrayStatus: function () {
  //   var timeSpent = utils.timeSpent(this.state.currentTracking.startTime, moment().valueOf());
  //   console.log("Updating: " + timeSpent);
  //   var that = this;
  //   // this.setState({
  //   //   liveTabText: this.state.currentTracking.path[0] + ": " + timeSpent
  //   // });
  //   ipcRenderer.send("currentStatus", {
  //     statusText: this.state.currentTracking.path[0] + ": " + timeSpent
  //   });

  // },

  startLiveTracking: function (data) {
    // mark it in console
    console.log("Start Tracking: ", data);
    // update state
    this.setState({
      currentTracking: data
    }, function () {
      this.save();
      hashHistory.push("/live");
    });
    this.timer = setInterval(() => this.liveTick(), 1000);
  },

  stopLiveTracking: function () {
    this.recordWork(this.state.currentTracking, { currentTracking: undefined });
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.updateLiveTab("Track");
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

  canvasToImage: function (canvas) {
    var dataUrl = canvas.toDataURL('image/png', 0.9)
    console.log(dataUrl);
    return nativeImage.createFromDataURL(dataUrl)
  },

  // updateIcon: function () {
  //   var canvas = document.createElement('canvas')
  //   canvas.width = 16;
  //   canvas.height = 16;
  //   var ctx = canvas.getContext('2d')
  //   ctx.fillStyle = 'red'
  //   ctx.fillRect(0, 0, 200, 200)
  //   ctx.fillStyle = 'black'

  //   ctx.font = "10px Comic Sans MS";
  //   ctx.fillText("142",1,12);
  //   var png = canvasBuffer(canvas, 'image/png')

  //   fs.writeFile(__dirname+'image.png', png, function (err) {
  //     console.log(err);
  //     throw err;
  //   })
  //   // img = nativeImage.createEmpty();
  //   ipcRenderer.send('updateIcons', png);
  // },


  switchTab: function (name) {
    this.setState({
      currentTab: name
    });
    hashHistory.push("/"+name);
    // this.updateIcon();

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
          records: {},
          liveTabText: "Track"
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
          <Tab currentTab={this.state.currentTab} inputRef={el => this.inputElement = el} glyphicon="edit" tabName="manual" text="Manual" onClick={this.switchTab} />
          <Tab currentTab={this.state.currentTab} glyphicon="time" tabName="live" text={this.state.liveTabText} onClick={this.switchTab} />
          <Tab currentTab={this.state.currentTab} glyphicon="list" tabName="list" text="List" onClick={this.switchTab} />
          <div className="restTabArea" />
        </div>
        <div id="mainArea">{children}</div>
      </div>
    )
  }
});