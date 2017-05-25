import moment from 'moment';

const Range = {

  standart: (start, end) => {
    let current = moment(start);
    let r = [];

    while (current <= end) {
      r.push(moment(current));
      current.add('days', 1);
    }

    return r;
  },

  middleRange: (d, i) => {
    let start_int = 0;
    let end_int = 0;

    start_int = end_int = parseInt(i / 2, 10);

    if (i % 2 === 0) {
      end_int -= 1;
    }

    let start = moment(d).subtract('days', start_int);
    let end = moment(d).add('days', end_int);

    return this.standart(start, end);
  },
}

export default Range;
