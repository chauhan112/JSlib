class Block {
        constructor(index, data) {
          this.index = index;
          this.spaces = new Set();
          this.info = data;
          this.cur_loc = { x: data.x, y: data.y };
        }
        updateSpaces() {
          let blockData = this.info;
          let info = this.cur_loc;
          allPositions = allPositions.difference(this.spaces);
          this.spaces.clear();
          let spaces = this.spaces;
          spaces.add(`${info.x},${info.y}`);
          for (let i = 1; i < blockData.height; i++) {
            spaces.add(`${info.x},${info.y + i}`);
          }
          for (let i = 1; i < blockData.width; i++) {
            spaces.add(`${info.x + i},${info.y}`);
          }
          if (blockData.height * blockData.width !== this.spaces.size) {
            console.log("error");
          }
          allPositions = allPositions.union(spaces);
          return spaces;
        }
        intersectOther(x, y) {
          if (!this.spaces.has(`${x},${y}`))
            if (allPositions.has(`${x},${y}`)) return true;
          return false;
        }
        canMoveToloc(x, y) {
          if (this.isThereAnyBlocker(x, y)) return false;
          if (this.intersectOther(x, y)) return false;
          let blockData = this.info;
          for (let i = 1; i < blockData.height; i++) {
            if (this.intersectOther(x, y + i)) return false;
          }
          for (let i = 1; i < blockData.width; i++) {
            if (this.intersectOther(x + i, y)) return false;
          }
          return true;
        }
        isThereAnyBlocker(x, y) {
          let dX = x - this.cur_loc.x;
          let dY = y - this.cur_loc.y;
          if (dX === 0) {
            for (let i = Math.min(y, this.cur_loc.y); i <= Math.abs(dY); i++) {
              if (this.intersectOther(x, i)) return true;
            }
          } else {
            for (let i = Math.min(x, this.cur_loc.x); i <= Math.abs(dX); i++) {
              if (this.intersectOther(i, y)) return true;
            }
          }
          return false;
        }
        hasReached(x, y) {
          return this.spaces.has(`${x},${y}`);
        }
      }