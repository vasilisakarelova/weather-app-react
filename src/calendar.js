import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import dates from './dates';

class Calendar extends Component {
  constructor() {
    let today = dates.new();

    super(),
    this.state = {
      current: today,
      days: dates.middleRange(today, 5)
    }
  }

  render() {
    let clss = 'day';
    let result = [];

    const days = this.state.days.map((day) => {
      switch (day.isSame(this.state.current)) {
        case true:
          clss += ' is-selected';
          result.push(
            <div className={clss}>
              {day.format('YYYY-MM-DD')}
            </div>
          )
          break;
        case false:
          result.push(
            <div className={clss}>
              {day.format('YYYY-MM-DD')}
            </div>
          )
          break;
      }
    });

    return (
      <div>
        { result }
      </div>
    );
  }
}

export default Calendar;
