const indexes = [7, 5, 15, 13, 3, 11, 1, 17, 9, 8, 6, 16, 14, 4, 12, 2, 18, 10];
const pars = [4, 4, 4, 3, 4, 4, 4, 3, 3, 4, 4, 4, 3, 4, 4, 4, 3, 3];
const holes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

function updateGameDescription() {
    const gameType = document.getElementById('gameType').value;
    const descEl = document.getElementById('gameDescription');

    const descriptions = {
        skins: "Each hole is worth a point (a skin). Win a hole outright to earn it. Ties carry over.",
        matchplay: "Players compete hole-by-hole. Whoever wins more holes wins the match. Ties give half-points",
        copenhagen: "3 or more player game. 6 points available per hole, 4 points to the winner, 2 points to second place. Ties split the points",
    };

    descEl.textContent = descriptions[gameType] || '';
}


if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    // Add event listener on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        const gameTypeSelect = document.getElementById('gameType');

        //   // Update description initially
        //   updateGameDescription();

        // Update description whenever selection changes
        gameTypeSelect.addEventListener('change', updateGameDescription);
    });
};

function addPlayer() {
    const container = document.getElementById('player-form');
    const currentCount = container.querySelectorAll('div.player-entry').length;

    // Player Container
    const playerContainer = document.createElement('div');
    playerContainer.className = 'player-entry flex flex-wrap';

    // Name Input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = `Player ${currentCount + 1}`;
    nameInput.className = 'player-name w-full border rounded p-2';


    // Gender select
    const genderSelect = document.createElement('select');
    genderSelect.className = 'player-gender border rounded p-2 w-20';
    genderSelect.innerHTML = `
        <option value="male">Man</option>
        <option value="female">Kvinna</option>
    `;

    // Tee select
    const teeSelect = document.createElement('select');
    teeSelect.className = 'player-tee border rounded p-2 w-20';
    teeSelect.innerHTML = `
    <option value="yellow">Gul</option>
    <option value="blue">Blå</option>
    <option value="red">Röd</option>
  `;

    // Handicap input
    const handicapInput = document.createElement('input');
    handicapInput.type = 'number';
    handicapInput.min = 0;
    handicapInput.max = 54;
    handicapInput.placeholder = 'HCP';
    handicapInput.className = 'player-handicap border rounded p-2 w-20';

    container.appendChild(playerContainer);
    playerContainer.appendChild(nameInput);
    playerContainer.appendChild(genderSelect);
    playerContainer.appendChild(teeSelect);
    playerContainer.appendChild(handicapInput);

}

function removePlayer() {
    const container = document.getElementById('player-form');
    const children = container.querySelectorAll('div.player-entry');

    if (children.length > 2) {
        children[children.length - 1].remove();
    }
}

function generateScoreCard() {
    // Fetch from stored data
    const gameData = JSON.parse(localStorage.getItem(gameKey));
    const numPlayers = gameData.players.length;
    const players = gameData.players.map(player => player.name);
    const handicaps = gameData.players.map(player => player.handicap);
    const playingHandicaps = gameData.players.map(player => player.playingHandicap);

    // const numPlayers = 3
    // const players = ["Tman", "Antman", "Jake the Cake"];
    // const handicaps = [15.4, 17.8, 5.7]
    // const playingHandicaps = [14, 17, 3];
    // End fetch from stored data



    const table = document.querySelector('table');

    // Table Header
    const thead = table.querySelector('thead');
    const th_tr1 = thead.querySelector('#th-tr1');
    const th_tr2 = thead.querySelector('#th-tr2');

    for (let i = 0; i < numPlayers; i++) {
        const nameCol = document.createElement('th');
        nameCol.innerText = players[i] + " HCP: " + handicaps[i] + " (" + playingHandicaps[i] + ")";
        nameCol.className = 'underline';
        nameCol.colSpan = 2;

        th_tr1.appendChild(nameCol);

        const SCORE = document.createElement('th');
        SCORE.innerText = "SCORE";
        SCORE.style = "font-size: 0.5rem;"
        const POÄNG = document.createElement('th');
        POÄNG.innerText = "POÄNG";
        POÄNG.style = "font-size: 0.5rem;"

        th_tr2.appendChild(SCORE);
        th_tr2.appendChild(POÄNG);
    }



    // Table Body
    const tableBody = table.querySelector('tbody');

    for (let i = 0; i < holes.length; i++) {
        const row = document.createElement('tr');
        row.className = "border-b-2 border-gray-600";
        tableBody.appendChild(row);

        const hole = document.createElement('td');
        hole.innerText = holes[i];
        row.appendChild(hole);

        const par = document.createElement('td');
        par.innerText = pars[i];
        row.appendChild(par);

        const index = document.createElement('td');
        index.innerText = indexes[i];
        row.appendChild(index);

        players.forEach(player => {
            const scoreCol = document.createElement('td');
            scoreCol.innerHTML = '<input id="' + player + "-score-" + holes[i] + '" min="1" max="25" class="w-full text-center" />';
            player + "-score-" + holes[i];
            scoreCol.addEventListener('change', updatePoints);
            row.appendChild(scoreCol);

            const pointCol = document.createElement('td');
            pointCol.id = player + "-point-" + holes[i];
            row.appendChild(pointCol);

        });
    }

    // Results
    const resRow = document.createElement('tr');
    resRow.className = "font-bold text-black border-b-2 border-gray-600 bg-yellow-600";
    resRow.innerHTML = `
        <td>TOT</td>
        <td>66</td>
        <td>TOT</td>
        `;
    tableBody.appendChild(resRow);

    players.forEach(player => {
        const scoreCol = document.createElement('td');
        scoreCol.id = player + 'totalScore';
        resRow.appendChild(scoreCol);

        const pointCol = document.createElement('td');
        pointCol.id = player + 'totalPoints';
        resRow.appendChild(pointCol);
    });
}


function updatePoints(event) {
    console.log('Changed element:', event.target.id);
    const changedElem = event.target;
    const parts = changedElem.id.split('-');
    const hole = Number(parts[parts.length - 1]);

    //Check if all scores are filled in
    const gameData = JSON.parse(localStorage.getItem(gameKey));
    const players = gameData.players.map(player => player.name);

    // const players = ["Tman", "Antman", "Jake the Cake"];
    // const playingHandicaps = [14, 17, 3];

    scores = [];

    players.forEach(player => {
        const score = parseFloat(document.getElementById(player + '-score-' + hole).value);
        if (!isNaN(score)) {
            scores.push(score);
        }
    });
    if (players.length != scores.length) {
        return;
    }

    // Save number of strokes to localStorage
    gameData.strokes[hole] = scores;

    //Remove number of extra strokes
    const playingHandicaps = gameData.players.map(player => player.playingHandicap);
    const index = indexes[hole - 1];
    let adjustedScores = scores

    for (let i = 0; i < players.length; i++) {
        const extraStrokes = Math.floor(playingHandicaps[i] / 18) + ((playingHandicaps[i] % 18) >= index ? 1 : 0);
        console.log(players[i] + "has " + extraStrokes + " extra strokes");
        console.log(index);
        adjustedScores[i] -= extraStrokes;
    }
    //Compare
    const gameType = gameData.gameType;
    if(gameType == 'copenhagen') {
        points = copenhagenPoints(adjustedScores);
    }
    if(gameType == 'matchplay') {
        points = matchplayPoints(adjustedScores);
    }
    if(gameType == 'skins') {
        points = skinsPoints(adjustedScores, hole);
    }

     // Save number of points to localStorage
     gameData.points[hole] = points;
     localStorage.setItem(gameKey, JSON.stringify(gameData));
    
    //Give points
    for (let i = 0; i < players.length; i++) {
        document.getElementById(players[i] + '-point-' + hole).innerText = points[i];
    }
    //Update total points
    players.forEach(player => {
        totalStrokes = 0;
        totalPoints = 0;
        for (let i = 0; i < holes.length; i++) {
            const strokes = parseFloat(document.getElementById(player + '-score-' + holes[i]).value);
            const points = parseFloat(document.getElementById(player + '-point-' + holes[i]).innerText);
            if (!isNaN(strokes)) {
                totalStrokes += strokes;
            }
            if (!isNaN(points)) {
                totalPoints += points;
            }
        }
        document.getElementById(player + 'totalPoints').innerText = totalPoints;
        document.getElementById(player + 'totalScore').innerText = totalStrokes;
    });
}

