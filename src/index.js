import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames'; // for building class names with dynamic data
import Api from './utils/api';
import { TweenLite, TweenMax, TimelineMax, TimelineLite } from 'gsap';

import draggable from './draggable';

let cities = [];
let cityWeather = []; // API cache
let currentCity = 0; // Index of current city displayed
const PropTypes = React.PropTypes;

const GetDates = (startDate, daysToAdd, dir) => {
  let aryDates = [];

  for(let i = 1; i <= daysToAdd; i++) {
    const currentDate = new Date();
    switch (dir) {
      case 'future':
        currentDate.setDate(startDate.getDate() + i);
        break;
       case 'past':
       currentDate.setDate(startDate.getDate() - i);
       break;
    }
    aryDates.push({ day: DayAsString(currentDate.getDay()), date: currentDate.getDate(), month: MonthAsString(currentDate.getMonth()), year: currentDate.getFullYear()});
  }

  return aryDates;
}

const MonthAsString = (monthIndex) => {
    const d = new Date();
    const month = new Array();
    month[0]="январь";
    month[1]="февраль";
    month[2]="март";
    month[3]="апрель";
    month[4]="май";
    month[5]="июнь";
    month[6]="июль";
    month[7]="август";
    month[8]="сентябрь";
    month[9]="октябрь";
    month[10]="ноябрь";
    month[11]="декабрь";

    return month[monthIndex];
}

const DayAsString = (dayIndex) => {
    const weekdays = new Array(7);
    weekdays[0] = "вс";
    weekdays[1] = "пн";
    weekdays[2] = "вт";
    weekdays[3] = "ср";
    weekdays[4] = "чт";
    weekdays[5] = "пт";
    weekdays[6] = "суб";

    return weekdays[dayIndex];
}

class CalendarBlocks extends React.Component {
  getNextDays(startDate) {
    const datesArr = GetDates(startDate, 12, 'future');
    let futureDates = [];

    datesArr.forEach(calendarDate => {
      futureDates.push(
        <div className="calendar-block">
          <div className="calendar-day-of-week">{ calendarDate.day }</div>
          <div className="calendar-date">{ calendarDate.date }</div>
        </div>
      );
    });

    return futureDates;
  }

  getPreviousDays(startDate) {
    const datesArr = GetDates(startDate, 10, 'past');
    let pastDates = [];

    datesArr.forEach(calendarDatePast => {
      pastDates.push(
        <div className="calendar-block">
          <div className="calendar-day-of-week">{ calendarDatePast.day }</div>
          <div className="calendar-date">{ calendarDatePast.date }</div>
        </div>
      );
    });

    return (pastDates.reverse());
  }

  render() {
    const startDate = new Date();

    return (
      <div>
        { this.getPreviousDays(startDate) }
        <div className="calendar-block">
          <div className="calendar-day-of-week">{ DayAsString(startDate.getDay()) }</div>
          <div className="calendar-date is-today">{ startDate.getDate() }</div>
        </div>
        { this.getNextDays(startDate) }
      </div>
    );
  }
}

class CalendarContainer extends React.Component {
  render() {
    const startDate = new Date();

    return (
      <div>
        <div className="calendar-curr-month">{ MonthAsString(startDate.getMonth()) } { startDate.getFullYear() }</div>
        <div className="draggable">
          <div className="calendar-container draggable-wrap">
            <div className="calendar-track draggable-inner">
              <CalendarBlocks />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Weather extends React.Component {
  constructor() {
    super(),
    this.state = {}
  }

  fetchData() {
    // Get the data from the cache if possible
    if (cityWeather[currentCity]) {
      this.updateData();
    }
    else {
      // Request new data to the API
      Api.get(cities[currentCity])
        .then(function(data) {
          cityWeather[currentCity] = data;
          this.updateData();
        }.bind(this));
    }
  }

  updateData() {
    // Update the data for the UI
    // cityWeather[currentCity] - array, where each element is a collection of data for one period of time (3h)
    this.setState( cityWeather[currentCity].list );
  }

  componentWillMount() {
    cities[0] = 'Moscow';

    // Create a timer to clear the cache after 5 minutes, so we can get updated data from the API
    setInterval(function() {
      cityWeather = []; // Empty the cache
    }, (1000*60*5));

    this.fetchData();
  }

  render() {
    const weatherHourly = this.state;
    let result = [];

    Object.keys(weatherHourly).map((period) => {
      if (period < 3) {
        const temp = Math.round(weatherHourly[period].main.temp);
        const humidity = Math.round(weatherHourly[period].main.humidity);
        const windSpeed = weatherHourly[period].wind.speed;

        result.push(
          <div className="weather-details">
            <div className="weather-param time">
              <span className="title">День и время: </span><span className="number">{ weatherHourly[period].dt_txt }</span>
            </div>
            <div className="weather-param temp">
              <span className="title">Температура воздуха: </span><span className="number">{ temp }°C</span>
            </div>
            <div className="weather-param humidity">
              <span className="title">Уровень влажности: </span><span className="number">{ humidity }%</span>
            </div>
            <div className="weather-param wind">
              <span className="title">Скорость ветра: </span><span className="number">{ windSpeed } м/с</span>
            </div>
          </div>
        );
      }
    });

    return (
      <div className="weather-widget">
        <div className="weather-city"><h1 className="city-title">{cities[currentCity]}</h1></div>
        <CalendarContainer />
        <section className="weather-details-container">
          { result }
        </section>
      </div>
    );
  }
}

const element = React.createElement(Weather, {});

ReactDOM.render(
  element,
  document.querySelector('#app')
);

const calendarContainer = document.querySelector('.calendar-container');
const calendarTrack = document.querySelector('.calendar-track');
const containerWidth = calendarContainer.clientWidth;
let trackWidth = 0;

[...document.querySelectorAll('.calendar-block')].forEach( block => {
  trackWidth += block.offsetWidth;
});


TweenLite.set(calendarTrack, { width: trackWidth+1 });
TweenLite.set(calendarContainer, { left: -(trackWidth-containerWidth)/2.2 });

module.hot.accept();
