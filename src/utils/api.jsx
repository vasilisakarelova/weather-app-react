const Fetch = require('whatwg-fetch');
const rootUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const apiUrl = '&units=metric&appid=0e9caf1a1c80d8826059849971fae213';

module.exports = {
  get(place) {
    return fetch(rootUrl + place + apiUrl, {
      headers: {
        // No need for special headers
      }
    })
      .then(function(response) {
        return response.json();
      });
  }
};
