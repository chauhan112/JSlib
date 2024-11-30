class Block {
    constructor(index, data) {
        this.index = index;
        this.spaces = new Set();
        this.info = data;
        this.cur_loc = { x: data.x, y: data.y };
        this.isHorizontal = data.width > data.height;
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

function makeGrid(rowNr, colNr, container) {
    for (let row = 0; row < rowNr; row++) {
        for (let col = 0; col < colNr; col++) {
            const cell = document.createElement("div");
            cell.className = "grid-cell";
            cell.style.left = col * GRID_SIZE + "px";
            cell.style.top = row * GRID_SIZE + "px";
            container.appendChild(cell);
        }
    }
    container.style.height = rowNr * GRID_SIZE + "px";
    container.style.width = colNr * GRID_SIZE + "px";
    winMessage = document.createElement("div");
    winMessage.className = "win-message";
    winMessage.id = "winMessage";
    winMessage.textContent = "Congratulations! You won!";
    container.appendChild(winMessage);
}
function makeBlocks(blocks, exitObjLoc, container) {
    blocks.forEach((blockData, index) => {
        const block = document.createElement("div");
        block.className = "block";
        if (blockData.isMain) block.className += " main-block";

        block.style.width = blockData.width * GRID_SIZE + "px";
        block.style.height = blockData.height * GRID_SIZE + "px";
        block.style.left = blockData.x * GRID_SIZE + "px";
        block.style.top = blockData.y * GRID_SIZE + "px";
        block.textContent = blockData.id;
        block.dataset.index = index;
        let state = new Block(index, blockData);
        blocksWithState.push(state);
        state.updateSpaces();
        block.addEventListener("mousedown", startDragging);
        container.appendChild(block);
        blockFormId[blockData.id] = state;
        state.htmlComp = block;
    });

    let cell = document.createElement("div");
    cell.className = "exit";
    cell.style.width = GRID_SIZE / 3 + "px";
    cell.style.height = GRID_SIZE + "px";
    cell.style.right = "-" + GRID_SIZE / 3 + "px";
    cell.style.top = exitObjLoc * GRID_SIZE + "px";
    container.appendChild(cell);
}
function startDragging(e) {
    selectedBlock = e.target;
    const rect = selectedBlock.getBoundingClientRect();
    offset.x = e.clientX - rect.left;
    offset.y = e.clientY - rect.top;

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDragging);
    selectedBlock.style.cursor = "grabbing";
}

function drag(e) {
    if (!selectedBlock) return;
    let index = selectedBlock.dataset.index;
    let state = blocksWithState[index];

    const container = gameContainer.getBoundingClientRect();
    const block = selectedBlock.getBoundingClientRect();
    const isHorizontal = block.width > block.height;

    let dX = e.clientX - container.left - offset.x;
    let dY = e.clientY - container.top - offset.y;
    let newX, newY;
    // Constrain movement based on orientation
    if (isHorizontal) {
        newY = parseInt(selectedBlock.style.top);
        newX = Math.max(0, Math.min(dX, container.width - block.width));
    } else {
        newX = parseInt(selectedBlock.style.left);
        newY = Math.max(0, Math.min(dY, container.height - block.height));
    }
    let x = Math.round(newX / 60);
    let y = Math.round(newY / 60);

    dX = state.cur_loc.x - x;
    dY = state.cur_loc.y - y;
    if (dX === 0 && dY === 0) return;

    if (!state.canMoveToloc(x, y)) return;
    state.cur_loc = { x: x, y: y };
    state.updateSpaces();
    newX = x * 60;
    newY = y * 60;
    selectedBlock.style.left = newX + "px";
    selectedBlock.style.top = newY + "px";

    // Check win condition
    if (state.info.isMain) {
        if (state.hasReached(gridNr - 1, doorLoc)) {
            winMessage.style.display = "block";
        }
    }
}
function moveTo(x, y, blockId) {
    let state = blockFormId[blockId];
    let dX = state.cur_loc.x - x;
    let dY = state.cur_loc.y - y;
    if (dX === 0 && dY === 0) return;
    if (!state.canMoveToloc(x, y)) return;
    state.cur_loc = { x: x, y: y };
    state.updateSpaces();
    newX = x * 60;
    newY = y * 60;
    let selectedBlock = state.htmlComp;
    selectedBlock.style.left = newX + "px";
    selectedBlock.style.top = newY + "px";
}
function stopDragging() {
    if (selectedBlock) {
        selectedBlock.style.cursor = "grab";
    }
    selectedBlock = null;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDragging);
}

function onBtnClick() {
    let inp = document.getElementById("inp").value;
    let inpS = inp.split(/ +/);
    blocks = inpS.slice(3);
    [ROWS, COLS] = inpS.slice(0, 3).map((x) => parseInt(x));
    // console.log(ROWS, COLS, doorLoc, blocks);
    gridNr = ROWS;
    let nB = [];
    while (blocks.length) nB.push(blocks.splice(0, 5));
    blocks = nB;
    blocks = blocks.map((arr) => {
        let [idd, orie, x, y, s] = arr;
        let isMain = idd == "0";
        let xx, yy, ss;
        xx = parseInt(x) - 1;
        yy = parseInt(y);
        ss = parseInt(s);
        if (orie == "h")
            return {
                x: xx,
                y: COLS - yy,
                width: ss,
                height: 1,
                isMain: isMain,
                id: idd,
            };

        return {
            x: xx,
            y: COLS - yy - ss + 1,
            width: 1,
            height: ss,
            isMain: isMain,
            id: idd,
        };
    });

    onResetClick();
}
function reset() {
    winMessage.style.display = "none";
    offset = { x: 0, y: 0 };
    selectedBlock = null;
    allPositions = new Set();
    gameContainer.innerHTML = "";
    blocksWithState = [];
    doorLoc = blocks[0].y;
}
function onResetClick() {
    reset();
    makeGrid(COLS, ROWS, gameContainer);
    makeBlocks(blocks, doorLoc, gameContainer);
}
function onMoveBlock() {
    let inp = document.getElementById("inp").value;
    let inpS = inp.split(/ +/);
    let steps = inpS.map((x) => parseInt(x));
    console.log(blockFormId);
    for (let i = 0; i < steps.length; i += 2) {
        setTimeout(() => {
            moveBlock(steps[i], steps[i + 1], i / 2);
        }, 100 * i);
    }
}
function moveBlock(id, moveBy, counter) {
    let b = blockFormId[id];
    let newX, newY;
    newX = b.cur_loc.x;
    newY = b.cur_loc.y;
    if (b.isHorizontal) {
        newX += moveBy;
    } else {
        newY += moveBy;
    }
    // let yTransform = COLS - b.cur_loc.y - this.spaces.size + 1;
    // moveTo(b.cur_loc.x, b.cur_loc.y, b.info.id);
    console.log(counter);
    moveTo(newX, newY, b.info.id);
}
function onMove() {
    let inp = document.getElementById("inp").value;
    let inpS = inp.split(/ +/);
    let steps = inpS.map((x) => parseInt(x));
    moveBlock(steps[0], steps[1]);
}
