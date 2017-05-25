import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TweenLite } from 'gsap';
import classNames from 'classnames';
import moment from 'moment';
import Draggable from 'react-draggable';

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
      rangeYear: this.middleRange(today, 5).year,
      dragStart: 0,
      dragEnd: 0
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

  handleStartDrag(ev) {
    this.setState({
      dragStart: ev.screenX
    });
  }

  handleStopDrag(ev) {
    this.setState({
      dragEnd: ev.screenX
    });

    let dragDistance = this.state.dragStart - this.state.dragEnd;
    switch (true) {
      case dragDistance < 0:
        let firstDaylisted = this.state.days.shift();
        this.setState({
          days: this.middleRange(firstDaylisted, 5).array,
          rangeMonth: this.middleRange(firstDaylisted, 5).month,
          rangeYear: this.middleRange(firstDaylisted, 5).year
        });

        break;
      case dragDistance > 0:
        let lastDaylisted = this.state.days.pop();
        this.setState({
          days: this.middleRange(lastDaylisted, 5).array,
          rangeMonth: this.middleRange(lastDaylisted, 5).month,
          rangeYear: this.middleRange(lastDaylisted, 5).year,
        });
        break;
      case dragDistance = 0:
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
              <div className='calendar-date' >
                {day.format('DD')}
              </div>
            </div>
          )
          break;
      }
    });

    return (
      <div className="calendar-wrapper">
        <div className="calendar-curr-month">
          { this.state.rangeMonth } { this.state.rangeYear }
        </div>
        <div className="calendar-container">
          <Draggable
            axis="x"
            handle=".calendar-track"
            bounds={{top: 0, left: 0, right: 0, bottom: 0}}
            onMouseDown={(ev) => this.handleStartDrag(ev)}
            onStop={(ev) => this.handleStopDrag(ev)}>
            <div className="calendar-track">
              { daysTrack }
            </div>
          </Draggable>
        </div>
      </div>
    );
  }
}

export default Calendar;
