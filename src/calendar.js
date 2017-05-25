import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import moment from 'moment';
import draggable from './draggable';

moment.locale('ru');
moment.updateLocale('ru', {
  weekdays : [
    "вс", "пн", "вт", "ср", "чт", "пт", "сб"
  ]
});
moment.updateLocale('ru', {
    months : [
        "январь", "февраль", "март", "апрель", "май", "июнь", "июль",
        "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
    ]
});

class Calendar extends Component {
  constructor() {
    let today = moment();

    super(),
    this.state = {
      current: today,
      days: this.middleRange(today, 5).array,
      rangeMonth: this.middleRange(today, 5).month,
      rangeYear: this.middleRange(today, 5).year
    }
  }

  range(start, end) {
    let current = moment(start);
    let r = [];

    while (current <= end) {
      r.push(moment(current));
      current.add('days', 1);
    }

    return r;
  }

  middleRange(d, i) {
    let start_int = 0;
    let end_int = 0;

    start_int = end_int = parseInt(i / 2, 6);

    if (i % 2 === 0) {
      end_int -= 1;
    }

    let start = moment(d).subtract('days', start_int);
    let end = moment(d).add('days', end_int);
    let rangeMonth = moment(start).format('MMMM');
    let rangeYear = moment(start).format('YYYY');

    return {
      array: this.range(start, end),
      month: rangeMonth,
      year: rangeYear
    };
  }

  updatedates(ev) {
    /*console.log(ev.currentTarget.childNodes[0].classList);*/
    switch (true) {
      case ev.currentTarget.classList.contains('right'):
        let lastDaylisted = this.state.days.pop();
        this.setState({
          days: this.middleRange(lastDaylisted, 5).array,
          rangeMonth: this.middleRange(lastDaylisted, 5).month,
          rangeYear: this.middleRange(lastDaylisted, 5).year,
        });

        break;
      case ev.currentTarget.classList.contains('left'):
        let firstDaylisted = this.state.days.shift();
        this.setState({
          days: this.middleRange(firstDaylisted, 5).array,
          rangeMonth: this.middleRange(firstDaylisted, 5).month,
          rangeYear: this.middleRange(firstDaylisted, 5).year
        });

        break;
    }
  }

  render() {
    let calendarBlock = 'calendar-block';
    let daysTrack = [];

    const days = this.state.days.forEach((day) => {
      switch (true) {
        case day.isSame(this.state.current, 'day'):
          daysTrack.push(
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
          daysTrack.push(
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
      <div className="calendar-wrapper draggable" onMouseUp={ (ev) => this.updatedates(ev) }>
        <div className="calendar-curr-month">
          { this.state.rangeMonth } { this.state.rangeYear }
        </div>
        <div className="calendar-container draggable-wrap">
          <div className="calendar-track draggable-inner">
            { daysTrack }
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
