class Tile {
  constructor(x, y, sprite, passable){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.passable = passable;
  }

  replace(newTileType){
    tiles[this.x][this.y] = new newTileType(this.x, this.y);
    return tiles[this.x][this.y];
  }

  // 距離算出（Manhattan distance）
  dist(other){
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }

  // あるタイルを基準として特定位置のタイルを返す
  getNeighbor(dx, dy){
    return getTile(this.x + dx, this.y + dy)
  }

  // 隣接するタイルをシャッフルして返す
  getAdjacentNeighbors(){
    return shuffle([
      this.getNeighbor(0, -1),
      this.getNeighbor(0, 1),
      this.getNeighbor(-1, 0),
      this.getNeighbor(1, 0)
    ]);
  }

  // 非通過性タイルを除外
  getAdjacentPassableNeighbors(){
    return this.getAdjacentNeighbors().filter(t => t.passable);
  }

  // 隔離されず隣接している全てのタイルを検出する
  getConnectedTiles(){
    let connectedTiles = [this];
    let frontier = [this];
    while (frontier.length){
      let neighbors = frontier.pop().getAdjacentPassableNeighbors().filter(t => !connectedTiles.includes(t));
      connectedTiles = connectedTiles.concat(neighbors);
      frontier = frontier.concat(neighbors);
    }
    return connectedTiles;
  }

  draw(){
    drawSprite(this.sprite, this.x, this.y);
  }
}

class Floor extends Tile{
  constructor(x, y){
    super(x, y, 30, true);
  }
}

class Wall extends Tile{
  constructor(x, y) {
    super(x, y, 31, false);
  }
}