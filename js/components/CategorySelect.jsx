'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select';


export default React.createClass({
  genOptions: function () {
    return Object.keys(this.props.options).map((k) => { return { label: k, value: k }});
  },

  render: function () {
      return (
          <div className={this.props.className}>
              <Select
                  placeholder={"Select "+this.props.name+"..."}
                  options={this.genOptions()}
                  onChange={this.props.onChange}
                  value={this.props.value}
              />
          </div>
      )
  }
});