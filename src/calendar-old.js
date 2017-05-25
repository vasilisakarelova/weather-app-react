import React from 'react';
import dates from './dates'

export default class Calendar extends React.Component {
  animate(transition, transform) {
    var wrapper = this.refs.wrapper.getDOMNode();

    /* Webkit */
    wrapper.style.WebkitTransition = transition;
    wrapper.style.WebkitTransform = transform;

    /* Moz */
    wrapper.style.MozTransition = transition;
    wrapper.style.MozTransform = transform;

    /* IE */
    wrapper.style.MsTransition = transition;
    wrapper.style.MsTransform = transform;

    /* Default */
    wrapper.style.transition = transition;
    wrapper.style.transform = transform;

  }

  up(date) {
    var start = dates.new(date).subtract('days', 2);
    var end = dates.new(this.state.current).add('days', 2);
    var range = dates.range(start, end);

    this.setState({
      current: date,
      days: range,
    });

    var top = (5 - range.length) * 20;

    this.animate('none', 'translate(0, ' + top + 'px)');

    setTimeout(() => {
      this.animate('all 200ms linear', 'translate(0, 0)');
    }, 10);

  }

  down(date) {
    var start = dates.new(this.state.current).subtract('days', 2);
    var end = dates.new(date).add('days', 2);
    var range = dates.range(start, end);

    this.setState({
      current: date,
      days: range,
    });

    var top = (5 - range.length) * 20;

    this.animate('none', 'translate(0, 0)');

    setTimeout( () => {
      this.animate('all 200ms linear', 'translate(0, ' + top + 'px)');
    }, 10);

  }

  scrollTo(date) {
    if (date.isAfter(this.state.current)) {
      this.down(date);
    }

    if (date.isBefore(this.state.current)) {
      this.up(date);
    }
  }

  render() {
    const days = this.state.days.map((day) => {
      var clss = 'day';
      if (day.isSame(this.state.current)) {
        clss += ' selected';
      }

      return (
        <div className={clss} onClick={ () => this.handleLoadMoreClick(day) }>
          {day.format('YYYY-MM-DD')}
        </div>
      );
    });

    var down14 = dates.new(this.state.current).add('days', 14);
    var up14 = dates.new(this.state.current).subtract('days', 14);

    return (
      <div className='date-picker'>
        <button onClick={ () => this.handleLoadMoreClick(up14)}>
          Up 14 days: {dates.format(up14)}
        </button>

        <button onClick={ () => this.handleLoadMoreClick(down14) }>
          Down 14 days: {dates.format(down14)}
        </button>

        <div className='days'>
          <div ref='wrapper' className='wrapper'>
            {days}
          </div>
        </div>
      </div>
    );
  }

};
