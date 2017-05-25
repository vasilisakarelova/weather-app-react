import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import moment from 'moment';
import dates from './dates';
import draggable from './draggable';

moment.locale('ru');
moment.updateLocale('ru', {
  weekdays : [
    "вс", "пн", "вт", "ср", "чт", "пт", "сб"
  ]
});

class Calendar extends Component {
  constructor() {
    let today = moment();

    super(),
    this.state = {
      current: today,
      days: dates.middleRange(today, 5)
    }
  }

  render() {
    let calendarBlock = 'calendar-block';
    let result = [];

    const days = this.state.days.forEach((day) => {
      switch (true) {
        case day.isSame(this.state.current, 'day'):
          result.push(
            <div className={calendarBlock}>
              <div className="calendar-day-of-week">
                {day.format('dddd')}
              </div>
              <div className='calendar-date is-selected'>
                {day.format('DD')}
              </div>
            </div>
          )
          break;
        default:
          result.push(
            <div className={calendarBlock}>
              <div className="calendar-day-of-week">
                {day.format('dddd')}
              </div>
              <div className='calendar-date'>
                {day.format('DD')}
              </div>
            </div>
          )
          break;
      }
    });

    return (
      <div className="calendar-container draggable-wrap">
        <div className="calendar-track draggable-inner">
          { result }
        </div>
      </div>
    );
  }
}

export default Calendar;
