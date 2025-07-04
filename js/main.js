const gameKey = 'golfGame';

if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
  // Add event listener on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const gameTypeSelect = document.getElementById('gameType');

    // Update description whenever selection changes
    gameTypeSelect.addEventListener('change', updateGameDescription);
  });
};

function startGameTeams() {
  const players = [];
  const nameSet = new Set();

  const playerForm = document.querySelector('.player-form:not(.hidden)');
  const playerEntries = playerForm.querySelectorAll('div.player-entry');

  playerEntries.forEach(entry => {
    const name = entry.querySelector('input.player-name').value.trim();
    console.log(name);
    console.log(entry.parentElement);
    const gender = entry.querySelector('select.player-gender').value;
    const tee = entry.querySelector('select.player-tee').value;
    const handicap = parseFloat(entry.querySelector('input.player-handicap').value);

    nameSet.add(name.toLowerCase());

    if (name && gender && tee && !isNaN(handicap)) {
      //Course Handicap = Handicap Index® x (Slope Rating™ / 113) + (Course Rating™ – par)
      if (gender == "male") {
        if (tee == "yellow") {
          slope = 118;
          rating = 63.9;
        }
        if (tee == "blue") {
          slope = 117;
          rating = 63.2;
        }
        if (tee == "red") {
          slope = 115;
          rating = 62.4;
        }
      }
      if (gender == "female") {
        if (tee == "yellow") {
          slope = 117;
          rating = 68.5;
        }
        if (tee == "blue") {
          slope = 115;
          rating = 67.4;
        }
        if (tee == "red") {
          slope = 112;
          rating = 65.8;
        }
      }

      const par = 66;
      //rounding is done later for teams
      const playingHandicap = handicap * (slope / 113) + (rating - par);
      players.push({ name, gender, tee, handicap, playingHandicap });
    }
  });

  if (nameSet.size != playerEntries.length) {
    alert("Namn måste vara unika");
    return;
  }

  if (players.length != playerEntries.length) {
    alert("Namn eller HCP fel (. ej , i HCP)");
    return;
  }

  const team1 = {
    name: players[0].name.charAt(0) + " + " + players[1].name.charAt(0),
    handicap: roundTo(
      players[0].handicap > players[1].handicap ?
      (players[0].handicap * 0.15) + (players[1].handicap * 0.35) :
      (players[0].handicap * 0.35) + (players[1].handicap * 0.15)
      , 1),
    playingHandicap: players[0].playingHandicap > players[1].playingHandicap ?
      Math.round((players[0].playingHandicap * 0.15) + (players[1].playingHandicap * 0.35)) :
      Math.round((players[0].playingHandicap * 0.35) + (players[1].playingHandicap * 0.15)),
  }

  const team2 = {
    name: players[2].name.charAt(0) + " + " + players[3].name.charAt(0),
    handicap: roundTo(
      players[2].handicap > players[3].handicap ?
      (players[2].handicap * 0.15) + (players[3].handicap * 0.35) :
      (players[2].handicap * 0.35) + (players[3].handicap * 0.15)
      , 1),
    playingHandicap: players[0].playingHandicap > players[3].playingHandicap ?
      Math.round((players[2].playingHandicap * 0.15) + (players[3].playingHandicap * 0.35)) :
      Math.round((players[2].playingHandicap * 0.35) + (players[3].playingHandicap * 0.15)),
  }

  const gameData = {
    players: [team1, team2],
    gameType: document.getElementById('gameType').value,
    strokes: [],
    points: [],
  };

  localStorage.setItem(gameKey, JSON.stringify(gameData));
  window.location.href = 'game.html';
}


function startGame() {
  const players = [];
  const nameSet = new Set();

  const playerForm = document.querySelector('.player-form:not(.hidden)');
  const playerEntries = playerForm.querySelectorAll('div.player-entry');

  playerEntries.forEach(entry => {
    const name = entry.querySelector('input.player-name').value.trim();
    const gender = entry.querySelector('select.player-gender').value;
    const tee = entry.querySelector('select.player-tee').value;
    const handicap = parseFloat(entry.querySelector('input.player-handicap').value);

    nameSet.add(name.toLowerCase());

    if (name && gender && tee && !isNaN(handicap)) {


      //Course Handicap = Handicap Index® x (Slope Rating™ / 113) + (Course Rating™ – par)
      if (gender == "male") {
        if (tee == "yellow") {
          slope = 118;
          rating = 63.9;
        }
        if (tee == "blue") {
          slope = 117;
          rating = 63.2;
        }
        if (tee == "red") {
          slope = 115;
          rating = 62.4;
        }
      }
      if (gender == "female") {
        if (tee == "yellow") {
          slope = 117;
          rating = 68.5;
        }
        if (tee == "blue") {
          slope = 115;
          rating = 67.4;
        }
        if (tee == "red") {
          slope = 112;
          rating = 65.8;
        }
      }

      const par = 66;
      const playingHandicap = Math.round(handicap * (slope / 113) + (rating - par));
      players.push({ name, gender, tee, handicap, playingHandicap });
    }
  });

  if (nameSet.size != playerEntries.length) {
    alert("Namn måste vara unika");
    return;
  }

  if (players.length != playerEntries.length) {
    alert("Namn eller HCP fel (. ej , i HCP)");
    return;
  }

  const gameData = {
    players,
    gameType: document.getElementById('gameType').value,
    strokes: [],
    points: [],
  };

  localStorage.setItem(gameKey, JSON.stringify(gameData));
  window.location.href = 'game.html';
}

function resetGame() {
  if (confirm("Avsluta?")) {
    localStorage.removeItem(gameKey);
    window.location.href = 'index.html';
  }
}

function copenhagenPoints(scores) {
  const indexedScores = scores.map((score, i) => ({ index: i, score }));

  // Sort by score ascending (lower is better)
  indexedScores.sort((a, b) => a.score - b.score);

  const points = new Array(scores.length).fill(0);

  // Find players with the best (lowest) score
  const bestScore = indexedScores[0].score;
  const firstPlace = indexedScores.filter(p => p.score === bestScore);

  if (firstPlace.length > 1) {
    // Tie for first
    firstPlace.forEach(p => points[p.index] = 6 / firstPlace.length);
    return points; // No second place awarded
  } else {
    // Single first place
    points[firstPlace[0].index] = 4;

    // Check for tie in second place
    const secondScore = indexedScores[firstPlace.length].score;
    const secondPlace = indexedScores.filter(p => p.score === secondScore && p.score !== bestScore);

    if (secondPlace.length > 1) {
      // Tie for second
      secondPlace.forEach(p => points[p.index] = 2 / secondPlace.length);
    } else if (secondPlace.length === 1) {
      // Single second place
      points[secondPlace[0].index] = 2;
    }
  }

  return points;
}

function matchplayPoints(scores) {
  const indexedScores = scores.map((score, i) => ({ index: i, score }));

  // Sort by score ascending (lower is better)
  indexedScores.sort((a, b) => a.score - b.score);

  const points = new Array(scores.length).fill(0);

  // Find players with the best (lowest) score
  const bestScore = indexedScores[0].score;
  const firstPlace = indexedScores.filter(p => p.score === bestScore);

  if (firstPlace.length > 1) {
    // Tie for first
    firstPlace.forEach(p => points[p.index] = 1 / firstPlace.length);
    return points; // No second place awarded
  } else {
    // Single first place
    points[firstPlace[0].index] = 1;
  }

  return points;
}

function skinsPoints(scores, hole) {
  const indexedScores = scores.map((score, i) => ({ index: i, score }));

  // Sort by score ascending (lower is better)
  indexedScores.sort((a, b) => a.score - b.score);

  const points = new Array(scores.length).fill(0);

  // Find players with the best (lowest) score
  const bestScore = indexedScores[0].score;
  const firstPlace = indexedScores.filter(p => p.score === bestScore);

  if (firstPlace.length > 1) {
    return points; // No second place awarded
  } else {
    // Single first place
    const prevTies = checkForPrevTies(hole);
    points[firstPlace[0].index] = 1 + prevTies;
  }

  return points;
}

function checkForPrevTies(hole) {
  // Check for previous ties
  const gameData = JSON.parse(localStorage.getItem(gameKey));
  prevTies = 0;
  for (let i = hole - 1; i > 0; i--) {

    for (let j = 0; j < gameData.players.length; j++) {
      if (gameData.points[i][j] != 0) {
        return prevTies;
      }
    }

    prevTies++;

  }
  return prevTies;
}

function roundTo(n, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(n * factor) / factor;
}
