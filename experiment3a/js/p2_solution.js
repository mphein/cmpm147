/* exported generateGrid, drawGrid */
/* global placeTile */
let floorChar = '.';
let visionRadius = 50;
// bats and light circle around mouse

/*
Used ChatGPT to help author this project.
*/

function generateGrid(numCols, numRows, dungeonCount) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  generatePaths(numCols, numRows, grid);
  placeRooms(numCols, numRows, grid, dungeonCount);
 
  return grid;
}


const lookup = [
  [19,12],  //  "0000":
  [22, 12],  //  "0001": north
  [23, 12],  //  "0010": south
  [23, 12],  //  "0011" north south
  [23, 12],  //  "0100" east
  [21, 13],  //  "0101" east north
  [23, 14],  //  "0110" east south
  [22, 12],  //  "0111"
  [22, 14],  //  "1000"
  [23, 12],  //  "1001" wall
  [23, 12],  // "1010" wall
  [29, -9],  //  "1011" ore
  [21, 12],  //  "1100" wall
  [0, 13],  //  "1101" smooth tile
  [27, 16],  //  "1110" tower
  [19, 9]   //  "1111" water
];



function drawGrid(grid) {
  background(0);
  renderBackground(grid);
  if (random() < .01) {
    background(255, 215, 0);
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j,'.')) {
          if (random() < .5) {
            placeTile(i, j, random(0, 7) | 0, random(28, 30) | 0);
          } else {
            placeTile(i, j, random(1, 5) | 0, random(21, 25) | 0);
          }
        } else {
          drawContext(grid,i,j,'.',0,9)
        }
      }
    }
  } else {
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j,'.')) {
          placeTile(i, j, random(1, 5) | 0, random(21, 25) | 0);
        } else {
          drawContext(grid,i,j,'.',0,9)
        }
      }
    }
  }  
  spawnChest(grid)

}

function renderBackground(grid) {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid,i,j,'_')) {
        placeTile(i, j, random(28, 29) | 0, random(21, 23) | 0);
      }
    }
  }
}

function spawnChest(grid) {
  let chest = false
  while (!chest) {
    let xPos = floor(random(0, grid.length + 1));
    let yPos = floor(random(0, grid[0].length + 1));
    if (gridCheck(grid, xPos, yPos, '.')) {
      placeTile(xPos, yPos, random(0, 5) | 0, random(28, 30) | 0);
      chest = true
    }
  }
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length) {
    if (j >= 0 && i < grid[0].length) {
      if (grid[i][j] == target) {
        return true;
      }
    }
  }
  return false;
}

function gridCode(grid, i, j, target) {
  let northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;
  
  // Combine the bits into a 4-bit code
  let code = (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
  return code;
}

function drawContext(grid, i, j, target, ti, tj) {
  let code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  
  placeTile(i,j, ti + tiOffset, tj + tjOffset);
}

function generatePaths(numCols, numRows, grid) {
  let startX = floor(random(numCols));
  let startY = floor(random(numRows));

  // Mark the starting position as part of the path
  grid[startY][startX] = '.';

  // Set the maximum number of steps for the random walk
  let maxSteps = random(floor(numCols * numRows /1.5), numCols * numRows);

  // Define the possible movements (up, down, left, right)
  const movements = [
    { dx: 0, dy: -1 }, // Up
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }   // Right
  ];

  // Perform the random walk
  for (let step = 0; step < maxSteps; step++) {
    // Randomly choose a direction to move
    let movement = movements[floor(random(movements.length))];

    // Calculate the new position
    let newX = startX + movement.dx;
    let newY = startY + movement.dy;

    // Check if the new position is within the grid bounds
    if (newX >= 0 && newX < numCols && newY >= 0 && newY < numRows) {
      // Mark the new position as part of the path
      grid[newY][newX] = '.';
      
      // Update the current position
      startX = newX;
      startY = newY;
    }
  }
}
  
function placeRooms(numCols, numRows, grid, dungeonCount) {
  while (dungeonCount > 0) {
    let startX = floor(random(numCols));
    let startY = floor(random(numRows));
    
    // Check if the starting point is on a floor tile
    if (grid[startY][startX] !== '.') {
      // If not, find the nearest floor tile
      let nearestFloor = findNearestFloor(numCols, numRows, grid, startX, startY);
      if (nearestFloor) {
        startX = nearestFloor.x;
        startY = nearestFloor.y;
      } else {
        // No floor tile found, skip room generation
        continue;
      }
    }
    // Generate room size
    let dungeonSizeX = floor(random(2, 5)); // Random size of dungeon
    let dungeonSizeY = floor(random(6, 10)); // Random size of dungeon

    // Place room in grid
    for (let i = startY; i < startY + dungeonSizeY && i < numRows; i++) {
      for (let j = startX; j < startX + dungeonSizeX && j < numCols; j++) {
        grid[i][j] = floorChar; // Floor tiles
      }
    }
    dungeonCount--;
  }
}

function findNearestFloor(numCols, numRows, grid, startX, startY) {
  const maxDistance = max(numCols, numRows); // Maximum distance to search
  for (let distance = 1; distance <= maxDistance; distance++) {
    for (let dx = -distance; dx <= distance; dx++) {
      for (let dy = -distance; dy <= distance; dy++) {
        let x = startX + dx;
        let y = startY + dy;
        if (x >= 0 && x < numCols && y >= 0 && y < numRows && grid[y][x] === '.') {
          // Found a floor tile within the search radius
          return { x, y };
        }
      }
    }
  }
  // No floor tile found within the search radius
  return null;
}



