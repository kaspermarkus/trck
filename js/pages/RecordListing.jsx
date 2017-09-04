'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

import ListingEntry from '../components/ListingEntry';
import moment from 'moment'


var Header = React.createClass({
  render: function () {
    return (
       <tr>
        <td colSpan="3" className={this.props.className}>{this.props.text}</td>
      </tr>

    );
  }
});


var RecordListing = React.createClass({
  renderAll: function () {
    var toRender = [];
    var records = this.props.getSystemState().records;
    var remainingKeys = Object.keys(records).sort((a,b) => b - a);

    var lastDate = undefined;

    var arr = remainingKeys.map((key) => {
      var items = [];
      var date = moment(key, "x");

      // if (lastDate && date.year() != lastDate.year()) {
      //   items.push(<h1 className="year">{date.year()}</h1>);
      // }

      if (!lastDate || date.month() != lastDate.month() || date.year() != lastDate.year()) {
        items.push(<Header className="month" text={date.format("MMMM YYYY")} />);
      }

      if (!lastDate || date.date() != lastDate.date()) {
        items.push(<Header className="date" text={date.format("dddd, D MMMM, YYYY")} />);
      }

      items.push(<ListingEntry recordKey={key} entry={records[key]} onEditEntry={this.handleEditEntry} />);
      lastDate = date;
      return items;
    });
    return arr;
  },



  header: function (className, text) {

  },

  handleEditEntry: function (recordId) {
    this.props.editRecord(recordId);
  },

  render: function () {
    var records = this.props.getSystemState().records;
    var remainingKeys = Object.keys(records).sort((a,b) => a - b);
    return (
      <div className="recordListingArea container-fluid">
        <table>
          {this.renderAll()}
        </table>
      </div>
    );
  }
});

 export default RecordListing;