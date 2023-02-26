// make the grid / 2d array
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i <= cols; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
// make the canvas
function createCanvas(width, height) {
  if (document.getElementById("grid")) {
    document.body.innerHTML = "";
  }
  let canvas = document.createElement("canvas");
  canvas.height = height;
  canvas.width = width;
  canvas.id = "grid";
  canvas.style.backgroundColor = "white";
  canvas.style.border = "1px solid black";
  document.body.appendChild(canvas);
  return canvas;
}
// make something that takes height and width and returns a canvas
function setUp(height, width) {
  height = height * 10;
  width = width * 10;
  let canvas = createCanvas(height, width);
  let grid = make2DArray(height, width);
  readFromGrid(canvas, grid);
  return grid;
}
// generate boxes in canvas based on values from array
function readFromGrid(canvas, grid) {
  let canvasCell = canvas.getContext("2d");
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      canvasCell.beginPath();
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        // mkae it black
        canvasCell.fillRect(x, y, resolution, resolution);
      }
      canvasCell.stroke();
    }
  }
}
// make the initial board random
function intial(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i <= cols; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j <= rows; j++) {
      arr[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return arr;
}

// search for neightbors around given x,y coordinate
function search(grid, x, y, length) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let rows = length;
      let cols = length;
      rows = (x + i + rows) % rows;
      cols = (y + j + cols) % cols;
      // using modulo to create a warp around
      sum += grid[rows][cols];
    }
  }
  return (sum -= grid[x][y]);
}

const resolution = 5;
let grid = intial(200, 200);
let canvas = createCanvas(1000, 1000);
readFromGrid(canvas, grid);

// run the simulation
function run(grid) {
  let next = make2DArray(200, 200);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let state = grid[i][j];
      let neighbors = search(grid, i, j, grid.length);
      if (state == 0 && neighbors == 3) {
        next[i][j] = 1;
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }
  let newCanvas = createCanvas(1000, 750);
  readFromGrid(newCanvas, next);
  return next;
}

let t = run(grid);
setInterval(function () {
  t = run(t);
}, 100);
