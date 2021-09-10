'use strict';

const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fetchLineups = require('./lineup-scraper');

const { s, t, w, p, l } = argv;

fetch(`https://liiga.fi/api/v1/schedule/${s}/${t}`)
  .then(res => res.json())
  .then(json => {
    return json.map((game) => ({
      id: game.fiha_id,
      date: game.date.replace(/-/g, ''),
      home: game.home_team_abbreviation,
      homeScore: game.home_goals,
      away: game.away_team_abbreviation,
      awayScore: game.away_goals,
    }));
  })
  .then(async (gameData) => {
  if (l) {
    const gamesWithLineUps = await enrichDataWithLineups(gameData);
    Promise.all(gamesWithLineUps).then((games) => handleOutput(games));
  } else {
    handleOutput(gameData);
  }
});

function enrichDataWithLineups(gameData) {
  return gameData.map(async (game) => {
    const { home, away } = await fetchLineups(s, game.id);
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
