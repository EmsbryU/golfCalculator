const gameKey = 'golfGame';

function startGame() {
    const players = [];
    const nameSet = new Set();

    const playerEntries = document.querySelectorAll('div.player-entry');

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

function copenhagenPoints(scores){
  const indexedScores = scores.map((score, i) => ({ index: i, score }));
  
  // Sort by score ascending (lower is better)
  indexedScores.sort((a, b) => a.score - b.score);

  const points = new Array(scores.length).fill(0);

  // Find players with the best (lowest) score
  const bestScore = indexedScores[0].score;
  const firstPlace = indexedScores.filter(p => p.score === bestScore);

  if (firstPlace.length > 1) {
    // Tie for first
    firstPlace.forEach(p => points[p.index] = 6/firstPlace.length);
    return points; // No second place awarded
  } else {
    // Single first place
    points[firstPlace[0].index] = 4;

    // Check for tie in second place
    const secondScore = indexedScores[firstPlace.length].score;
    const secondPlace = indexedScores.filter(p => p.score === secondScore && p.score !== bestScore);

    if (secondPlace.length > 1) {
      // Tie for second
      secondPlace.forEach(p => points[p.index] = 2/secondPlace.length);
    } else if (secondPlace.length === 1) {
      // Single second place
      points[secondPlace[0].index] = 2;
    }
  }

  return points;
}

function matchplayPoints(scores){
  const indexedScores = scores.map((score, i) => ({ index: i, score }));
  
  // Sort by score ascending (lower is better)
  indexedScores.sort((a, b) => a.score - b.score);

  const points = new Array(scores.length).fill(0);

  // Find players with the best (lowest) score
  const bestScore = indexedScores[0].score;
  const firstPlace = indexedScores.filter(p => p.score === bestScore);

  if (firstPlace.length > 1) {
    // Tie for first
    firstPlace.forEach(p => points[p.index] = 1/firstPlace.length);
    return points; // No second place awarded
  } else {
    // Single first place
    points[firstPlace[0].index] = 1;
  }

  return points;
}

function matchplayPoints(scores){
  const indexedScores = scores.map((score, i) => ({ index: i, score }));
  
  // Sort by score ascending (lower is better)
  indexedScores.sort((a, b) => a.score - b.score);

  const points = new Array(scores.length).fill(0);

  // Find players with the best (lowest) score
  const bestScore = indexedScores[0].score;
  const firstPlace = indexedScores.filter(p => p.score === bestScore);

  if (firstPlace.length > 1) {
    // Tie for first
    firstPlace.forEach(p => points[p.index] = 1/firstPlace.length);
    return points; // No second place awarded
  } else {
    // Single first place
    points[firstPlace[0].index] = 1;
  }

  return points;
}

