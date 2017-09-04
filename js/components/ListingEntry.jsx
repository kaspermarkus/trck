'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

var moment = require("moment");


export default React.createClass({
  renderTime: function () {
    var entry = this.props.entry;
    return (
      <span className="timerange">
        <span className="time">{moment(entry.startTime).format("kk:mm")}</span>-<span className="time">{moment(entry.endTime).format("kk:mm")}</span>
      </span>
    )
  },

  renderDiff: function (start, end) {
    var diff = moment.utc(moment(end).diff(moment(start)));
    var formatted = diff.format("HH") + "h" + diff.format("mm") + "m";
    return <span className="timediff">({formatted})</span>;
  },

  ppCategory: function () {
    return (
      <span className="category">
        <font className="project">{this.props.entry.path[0]}</font>
        <font className="task">{this.props.entry.path[1] ? " - " + this.props.entry.path[1] : ""}</font>
        <font className="subtask">{this.props.entry.path[2] ? " - " + this.props.entry.path[2] : ""}</font>
      </span>
    )
  },

  render: function () {
    return (
      <tr className="listingEntry">
        <td className="timeCell">
          {this.renderTime()}
          {this.renderDiff(this.props.entry.startTime, this.props.entry.endTime)}
        </td>
        <td className="descriptionCell">
          {this.ppCategory()}:
          <span className="description"> {this.props.entry.description}</span>
        </td>
        <td>
          <span className="editButton glyphicon glyphicon-edit" aria-hidden="true" onClick={() => this.props.onEditEntry(this.props.recordKey)}></span>
        </td>
      </tr>
    );
  }
});