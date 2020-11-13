'use strict';

const scrapeIt = require('scrape-it');

const playerData = {
  name: {
    selector: '.head',
  },
  players: {
    listItem: '.player',
    data: {
      number: {
        selector: '.jersey',
        convert: (x) => x.substring(1),
      },
      name: {
        selector: '.name',
      },
      position: {
        closest: 'div',
        attr: 'class',
        convert: (x) => x.charAt(0),
      },
    },
  },
};

const scrapeLineups = (season, matchId) =>
  scrapeIt(`https://liiga.fi/fi/ottelut/${season}/runkosarja/${matchId}/kokoonpanot/`, {
    home: {
      listItem: '.rosters .team.home .line',
      data: playerData,
    },
    away: {
      listItem: '.rosters .team.away .line',
      data: playerData,
    },
  });

module.exports = scrapeLineups;
