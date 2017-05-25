import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames'; // for building class names with dynamic data
import { TweenLite, TweenMax, TimelineMax, TimelineLite } from 'gsap';
import Api from './utils/api';
import Calendar from './calendar';
import draggable from './draggable';

const PropTypes = React.PropTypes;
let cities = [];
let cityWeather = []; // API cache
let currentCity = 0; // Index of current city displayed

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
        <div className="weather-city"><h1 className="city-title">{ cities[currentCity] }</h1></div>
        <Calendar />
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

TweenLite.set(calendarContainer, { left: -(trackWidth - containerWidth)/2 });
TweenLite.set(calendarTrack, { width: trackWidth+1 });

module.hot.accept();
