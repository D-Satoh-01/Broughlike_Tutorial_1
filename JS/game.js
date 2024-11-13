spritesheet = new Image();
spritesheet.src = 'spritesheet.png';

let pressKeyFlagLeft = false;
let pressKeyFlagRight = false;
let pressKeyFlagUp = false;
let pressKeyFlagDown = false;
let releaseKeyFlagLeft = false;
let releaseKeyFlagRight = false;
let releaseKeyFlagUp = false;
let releaseKeyFlagDown = false;


function setupCanvas(){
  screen = document.querySelector("canvas").getContext("2d");
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = tileSize * (numTiles + UIWidth);
  canvas.height = tileSize * numTiles;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  ctx.imageSmoothingEnabled = false;
}

function drawSprite(sprite, x, y){
  screen.drawImage(
    spritesheet,
    sprite*32,
    0,
    32,
    32,
    x * tileSize,
    y * tileSize,
    tileSize,
    tileSize
  );
}

function drawText(text, size, centered, textY, color){
  ctx.fillStyle = color;
  ctx.font = size + "px monospace";
  let textX;
  if (centered){
    textX = (canvas.width - ctx.measureText(text).width) / 2;
  } else {
    textX = canvas.width - UIWidth * tileSize + 25;
  }
  ctx.fillText(text, textX, textY);
}

function draw(){
  if (gameState == "running" || gameState == "dead"){
    screen.clearRect(0, 0, canvas.width, canvas.height);

    for (let i=0; i<numTiles; i++){
      for (let j=0; j<numTiles; j++){
        getTile(i, j).draw();
      }
    }
    for (let i=0; i<monsters.length; i++){
      monsters[i].draw();
    }

    player.draw();

    drawText("Level: " + level, 30, false, 40, "white");
    drawText("Score: " + score, 30, false, 70, "white");
  }
}

// ワールドとモンスターを更新
function tick(){
  for (let k = monsters.length - 1; k >= 0; k--){
    if (!monsters[k].dead){
      monsters[k].update();
    } else {
      monsters.splice(k, 1);
    }
  }
  if (player.dead){
    addScore(score, false);
    gameState = "dead";
  }

  spawnCounter --;
  if (spawnCounter <= 0){
    spawnMonster();
    spawnCounter = spawnRate;
    spawnRate --;
  }
}

function showTitle(){
  ctx.fillStyle = 'rgba(20,20,20,.75)';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  gameState = "title";

  drawText("Shadefall Dungeons", 70, true, canvas.height/2 -70, "white");
  drawText("Press any key", 30, true, canvas.height/2 + 200, "white");

  drawScores();
}

function startGame(){                                           
  level = 1;
  score = 0;
  startLevel(startingHp);

  gameState = "running";
  update();
}

function startLevel(playerHp){    
  spawnRate = 15;
  spawnCounter = spawnRate;
  
  generateLevel();

  player = new Player(randomPassableTile());
  player.hp = playerHp;

  randomPassableTile().replace(Exit);
}

document.addEventListener('keydown', function(event){
  if (gameState == "running"){
    if (event.code == 'KeyW' || event.code == 'ArrowUp'){
      pressKeyFlagUp = true;
    }
    if (event.code == 'KeyS' || event.code == 'ArrowDown'){
      pressKeyFlagDown = true;
    }
    if (event.code == 'KeyA' || event.code == 'ArrowLeft'){
      pressKeyFlagLeft = true;
    }
    if (event.code == 'KeyD' || event.code == 'ArrowRight'){
      pressKeyFlagRight = true;
    }
  }
});

document.addEventListener('keyup', function(event){
  if(gameState == "title"){                              
    startGame();                
  }else if(gameState == "dead"){                             
    showTitle();                                        
  }else if(gameState == "running"){
    if (event.code == 'KeyW' || event.code == 'ArrowUp'){
      releaseKeyFlagUp = true;
        }
    if (event.code == 'KeyS' || event.code == 'ArrowDown'){
      releaseKeyFlagDown = true;
    }
    if (event.code == 'KeyA' || event.code == 'ArrowLeft'){
      releaseKeyFlagLeft = true;
    }
    if (event.code == 'KeyD' || event.code == 'ArrowRight'){
      releaseKeyFlagRight = true;
    }
  }
});

function movePlayer(){
  if (gameState == "running"){
    if (releaseKeyFlagLeft == true && pressKeyFlagDown == false && pressKeyFlagUp == false){
      player.tryMove(-1, 0);  // 移動：左
      resetMoveFlags();
    }
    if (releaseKeyFlagRight == true && pressKeyFlagDown == false && pressKeyFlagUp == false){
      player.tryMove(1, 0);  // 移動：右
      resetMoveFlags();
    }
    if (releaseKeyFlagUp == true && pressKeyFlagLeft == false && pressKeyFlagRight == false){
      player.tryMove(0, -1);  // 移動：上
      resetMoveFlags();
    }
    if (releaseKeyFlagDown == true && pressKeyFlagLeft == false && pressKeyFlagRight == false){
      player.tryMove(0, 1);  // 移動：下
      resetMoveFlags();
    }
    if (releaseKeyFlagLeft == true && releaseKeyFlagUp == true){
      player.tryMove(-1, -1);  // 移動：左上
      resetMoveFlags();
    }
    if (releaseKeyFlagRight == true && releaseKeyFlagUp == true){
      player.tryMove(1, -1);  // 移動：右上
      resetMoveFlags();
    }
    if (releaseKeyFlagLeft == true && releaseKeyFlagDown == true){
      player.tryMove(-1, 1);  // 移動：左下
      resetMoveFlags();
    }
    if (releaseKeyFlagRight == true && releaseKeyFlagDown == true){
      player.tryMove(1, 1);  // 移動：右下
      resetMoveFlags();
    }
  }
}

function resetMoveFlags(){
  pressKeyFlagUp = false;
  pressKeyFlagDown = false;
  pressKeyFlagLeft = false;
  pressKeyFlagRight = false;
  releaseKeyFlagUp = false;
  releaseKeyFlagDown = false;
  releaseKeyFlagLeft = false;
  releaseKeyFlagRight = false;
}

function getScores(){
  if (localStorage["scores"]){
    return JSON.parse(localStorage["scores"]);
  } else {
    return [];
  }
}

function addScore(score, won){
  let scores = getScores();
  let scoreObject = {score: score, run: 1, totalScore: score, active: won};
  let lastScore = scores.pop();

  if (lastScore){
    if (lastScore.active){
      scoreObject.run = lastScore.run + 1;
      scoreObject.totalScore += lastScore.totalScore;
    } else {
      scores.push(lastScore);
    }
  }
  scores.push(scoreObject);

  localStorage["scores"] = JSON.stringify(scores);
}

function drawScores(){
  let scores = getScores();
  if (scores.length){
    drawText(
      rightPad(["RUN", "SCORE", "TOTAL"]),
      18,
      true,
      canvas.height/2,
      "white"
    );

    let newestScore = scores.pop();
    scores.sort(function(a, b){
      return b.totalScore - a.totalScore;
    });
    scores.unshift(newestScore);

    for (let i=0; i<Math.min(10, scores.length); i++){
      let scoreText = rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
      drawText(
        scoreText,
        18,
        true,
        canvas.height/2 + 24+i*24,
        i == 0 ? "yellow" : "white"
      );
    }
  }
}


function update(){
  draw();
  movePlayer();

  requestAnimationFrame(update);
}

