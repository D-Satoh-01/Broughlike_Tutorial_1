class Monster {
  constructor(tile, sprite, fullHp, hp){
    this.move(tile);
    this.sprite = sprite;
    this.fullHp = fullHp;
    this.hp = hp;
    this.teleportCounter = 2;
  }

  heal(damage){
    this.hp = Math.min(this.fullHp, this.hp + damage);
  }

  update(){
    this.teleportCounter --;
    if (this.stunned || this.teleportCounter > 0){
      this.stunned = false;
      return;
    }
    this.doStuff();
  }

  doStuff(){
    let neighbors = this.tile.getAdjacentPassableNeighbors();

    neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

    if (neighbors.length){
      neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
      let newTile = neighbors[0];
      this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
    }
  }

  draw(){
    if (this.teleportCounter > 0){
      drawSprite(17, this.tile.x, this.tile.y);
    } else {
      drawSprite(this.sprite, this.tile.x, this.tile.y);
      this.drawHp();
    }
  }

  drawHp(){
    if (this.hp == this.fullHp){
      //drawSprite(19, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*10 && this.hp >= this.fullHp/10*9){
      drawSprite(20, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*9 && this.hp >= this.fullHp/10*8){
      drawSprite(21, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*8 && this.hp >= this.fullHp/10*7){
      drawSprite(22, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*7 && this.hp >= this.fullHp/10*6){
      drawSprite(23, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*6 && this.hp >= this.fullHp/10*5){
      drawSprite(24, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*5 && this.hp >= this.fullHp/10*4){
      drawSprite(25, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*4 && this.hp >= this.fullHp/10*3){
      drawSprite(26, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*3 && this.hp >= this.fullHp/10*2){
      drawSprite(27, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*2 && this.hp >= this.fullHp/10*1){
      drawSprite(28, this.tile.x, this.tile.y);
    }
    if (this.hp < this.fullHp/10*1 && this.hp >= this.fullHp/10*0){
      drawSprite(29, this.tile.x, this.tile.y);
    }
  }

  // アクション(移動・攻撃)可能かどうか判定する
  tryMove(dx, dy){
    let newTile = this.tile.getNeighbor(dx, dy);
    if (newTile.passable){
      if (!newTile.monster){
        this.move(newTile);
      } else {
        if (this.isPlayer != newTile.monster.isPlayer){
          this.attackedThisTurn = true;
          newTile.monster.stunned = true;
          newTile.monster.hit(1);
        }
      }
      return true;
    }
  }

  hit(damage){
    this.hp -= damage;
    if(this.hp <= 0){
      this.die();
    }
  }

  die(){
    this.dead = true;
    this.tile.monster = null;
    this.sprite = 18;
  }

  move(tile){
    if (this.tile){
      this.tile.monster = null;
    }
    this.tile = tile;
    tile.monster = this;
    tile.stepOn(this);
  }
}

class Player extends Monster {
  constructor(tile){
    super(tile, 0, 5, 5);
    this.isPlayer = true;
    this.teleportCounter = 0;
  }
  // プレイヤーのアクション後にtickを更新させる
  tryMove(dx, dy){
    if (super.tryMove(dx, dy)){
      tick();
    }
  }
}

class Slime_Gr extends Monster{
  constructor(tile){
    super(tile, 1, 2, 2);
  }
}

class Slime_Bu extends Monster{
  constructor(tile){
    super(tile, 2, 1, 1);
  }

  // 1ターンに2回移動する
  doStuff(){
    this.attackedThisTurn = false;
    super.doStuff();

    if (!this.attackedThisTurn){
      super.doStuff();
    }
  }
}

class Slime_Re extends Monster{
  constructor(tile){
    super(tile, 3, 1, 1);
  }
}

class Slime_Or extends Monster{
  constructor(tile){
    super(tile, 4, 5, 5);
  }

  // 1ターンおきに休止する
  update(){
    let startedStunned = this.stunned;
    super.update();
    if (!startedStunned){
      this.stunned = true;
    }
  }

  // 壁を食べて回復する
  doStuff(){
    let neighbors = this.tile.getAdjacentNeighbors().filter(t => !t.passable && inBounds(t.x, t.y));
    if (neighbors.length){
      neighbors[0].replace(Floor);
      this.heal(0.5);
    } else {
      super.doStuff();
    }
  }

}

class Slime_Ye extends Monster{
  constructor(tile){
    super(tile, 5, 2, 2);
  }

  doStuff(){
    let neighbors = this.tile.getAdjacentPassableNeighbors();
    if (neighbors.length){
      this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
    }
  }
}