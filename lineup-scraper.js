"use strict";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function getPlayer(line, role, position) {
  const player = line.find((player) => player.role === role);
  return player
    ? {
        number: player.jersey,
        name: `${player.lastName}, ${player.firstName}`,
        position,
      }
    : undefined;
}

function getGoalies(data) {
  const goalies = data
    .filter((player) => player.role === "GOALIE")
    .sort((a, b) => a.line - b.line);
  return {
    name: "Maalivahdit",
    players: goalies
      .sort((a, b) => a.line - b.line)
      .map((goalie) => ({
        number: goalie.jersey,
        name: `${goalie.lastName}, ${goalie.firstName}`,
        position: "g",
      })),
  };
}

function getLine(data, lineNumber) {
  const line = data.filter(
    (player) => player.line === lineNumber && player.role !== "GOALIE"
  );
  return {
    name: `${lineNumber}. Kenttä`,
    players: [
      getPlayer(line, "LEFT_WING", "f"),
      getPlayer(line, "CENTER", "f"),
      getPlayer(line, "RIGHT_WING", "f"),
      getPlayer(line, "LEFT_DEFENSEMAN", "d"),
      getPlayer(line, "RIGHT_DEFENSEMAN", "d"),
    ].filter((item) => item !== undefined),
  };
}

function getLineup(team) {
  return [
    getGoalies(team),
    getLine(team, 1),
    getLine(team, 2),
    getLine(team, 3),
    getLine(team, 4),
  ];
}

const fetchLineups = (season, matchId) =>
  fetch(`https://liiga.fi/api/v1/games/${season}/${matchId}`)
    .then((res) => res.json())
    .then((json) => ({
      home: json.homeTeamPlayers ? getLineup(json.homeTeamPlayers) : [],
      away: json.awayTeamPlayers ? getLineup(json.awayTeamPlayers) : [],
    }));

module.exports = fetchLineups;
