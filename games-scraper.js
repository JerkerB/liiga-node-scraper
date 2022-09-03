'use strict';

const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fetchLineups = require('./lineup-scraper');

const { s, t, w, p, l } = argv;

fetch(`https://liiga.fi/api/v1/games?tournament=${t}&season=${s}`)
  .then(res => res.json())
  .then(json => {
    console.log(json)
    return json.map((game) => ({
      id: game.id,
      date: game.start.replace(/-/g, '').split('T')[0],
      home: game.homeTeam.teamName,
      homeScore: game.homeTeam.goals,
      away: game.awayTeam.teamName,
      awayScore: game.awayTeam.goals,
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
