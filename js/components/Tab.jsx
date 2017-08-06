'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default React.createClass({
  handleClick: function () {
    this.props.onClick(this.props.tabName);
  },

  render: function () {
      return (
          <div className={(this.props.currentTab === this.props.tabName ? "selected " : "") + "tab " + this.props.tabName} onClick={this.handleClick}>
            <span className={"icon glyphicon glyphicon-"+this.props.glyphicon} aria-hidden="true" />
            <button className="">{this.props.text}</button>
          </div>
      )
  }
});