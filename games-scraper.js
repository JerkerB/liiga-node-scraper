'use strict';

const argv = require('minimist')(process.argv.slice(2));
const scrapeIt = require('scrape-it');
const fs = require('fs');

const { s, t, w, p } = argv;

scrapeIt(`https://liiga.fi/fi/ottelut/${s}/${t}/`, {
  games: {
    listItem: '.games-list-table > tbody > tr[data-time]',
    data: {
      date: {
        attr: 'data-time'
      },
      home: {
        selector: '.ta-l > a',
        convert: x => x.split('-')[0].trim()
      },
      homeScore: {
        selector: 'td',
        eq: 5,
        convert: x => (x.trim() == '-' ? undefined : parseInt(x.split('—')[0].trim()))
      },
      away: {
        selector: '.ta-l > a',
        convert: x => x.split('-')[1].trim()
      },
      awayScore: {
        selector: 'td',
        eq: 5,
        convert: x => (x.trim() == '-' ? undefined : parseInt(x.split('—')[1].trim()))
      }
    }
  }
}).then(({ data }) => {
  if (p) {
    console.log(data);
  }
  if (w && w.length > 0) {
    fs.writeFileSync(w, JSON.stringify(data));
  }
});
