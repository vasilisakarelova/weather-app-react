import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import moment from 'moment';

class CalendarBlock extends Component {
  constructor(props) {
    super(props),
    this.state = {}
  }

  render() {
    let calendarBlock = 'calendar-block';
    let today = moment();
    let daysTrack = [];

    this.props.days.forEach((day) => {
      switch (true) {
        case day.isSame(today, 'day'):
          daysTrack.push(
            <div className={calendarBlock}>
              <div className="calendar-day-of-week">
                {day.format('dddd')}
              </div>
              <div className='calendar-date is-selected'>
                {day.format('DD')}
              </div>
            </div>
          );
          return {daysTrack};
          break;
        default:
          return (
            <div className={calendarBlock}>
              <div className="calendar-day-of-week">
                {day.format('dddd')}
              </div>
              <div className='calendar-date'>
                {day.format('DD')}
              </div>
            </div>
          );
          break;
      }
    });
  }
}

export default CalendarBlock;
