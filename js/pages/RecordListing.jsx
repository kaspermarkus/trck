'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

import ListingEntry from '../components/ListingEntry';
import moment from 'moment'


var RecordListing = React.createClass({
  renderAll: function () {
    var toRender = [];
    var records = this.props.getSystemState().records;
    var remainingKeys = Object.keys(records).sort((a,b) => b - a);

    var lastDate = undefined;

    var arr = remainingKeys.map((key) => {
      var items = [];
      var date = moment(key, "x");

      if (lastDate && date.year() != lastDate.year()) {
        items.push(<h1 className="year">{date.year()}</h1>);
      }

      if (!lastDate || date.month() != lastDate.month()) {
        items.push(<h2 className="month">{date.format("MMMM")}</h2>);
      }

      if (!lastDate || date.date() != lastDate.date()) {
        items.push(<h3 className="date">{date.format("dddd, D MMMM, YYYY")}</h3>);
      }

      items.push(<ListingEntry recordKey={key} entry={records[key]} onEditEntry={this.handleEditEntry} />);
      lastDate = date;
      return items;
    });
    return arr;
  },

  handleEditEntry: function (recordId) {
    this.props.editRecord(recordId);
  },

  render: function () {
    var records = this.props.getSystemState().records;
    var remainingKeys = Object.keys(records).sort((a,b) => a - b);
    return (
      <div className="recordListingArea container-fluid">
        {this.renderAll()}
      </div>
    );
  }
});

 export default RecordListing;