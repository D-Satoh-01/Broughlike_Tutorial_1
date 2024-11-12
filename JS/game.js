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

function draw(){
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
}

document.addEventListener('keydown', function(event){
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
});

document.addEventListener('keyup', function(event){
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
});

function movePlayer(){
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



function update(){
  draw();
  movePlayer();
}

spritesheet.onload = function() {
  setInterval(update, 15);
}


