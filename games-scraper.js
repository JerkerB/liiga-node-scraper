'use strict';

const argv = require('minimist')(process.argv.slice(2));
const scrapeIt = require('scrape-it');
const fs = require('fs');
const scrapeLineups = require('./lineup-scraper');

const { s, t, w, p, l } = argv;

scrapeIt(`https://liiga.fi/fi/ottelut/${s}/${t}/`, {
  games: {
    listItem: '.games-list-table > tbody > tr[data-time]',
    data: {
      id: {
        selector: '.ta-l > a',
        attr: 'href',
        convert: (url) => {
          const parts = url.split('/');
          return parseInt(parts[parts.length - 2]);
        },
      },
      date: {
        attr: 'data-time',
      },
      home: {
        selector: '.ta-l > a',
        convert: (x) => x.split('-')[0].trim(),
      },
      homeScore: {
        selector: 'td',
        eq: 5,
        convert: (x) => (x.trim() == '-' ? undefined : parseInt(x.split('—')[0].trim())),
      },
      away: {
        selector: '.ta-l > a',
        convert: (x) => x.split('-')[1].trim(),
      },
      awayScore: {
        selector: 'td',
        eq: 5,
        convert: (x) => (x.trim() == '-' ? undefined : parseInt(x.split('—')[1].trim())),
      },
    },
  },
}).then(async ({ data }) => {
  if (l) {
    const gamesWithLineUps = await enrichDataWithLineups(data);
    Promise.all(gamesWithLineUps).then((games) => handleOutput(games));
  } else {
    handleOutput(data);
  }
});

function enrichDataWithLineups(data) {
  return data.games.map(async (game) => {
    const { data } = await scrapeLineups(s, game.id);
    const { home, away } = data;
    game.homeLineup = home;
    game.awayLineup = away;
    return game;
  });
}

function handleOutput(games) {
  if (p) {
    console.log(games);
  }
  if (w && w.length > 0) {
    fs.writeFileSync(w, JSON.stringify(games));
  }
}
