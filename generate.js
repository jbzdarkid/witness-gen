/**
 * A 2x2 grid is listed as a 5x5:
 * Corner, edge, corner, edge, corner
 * Edge,   cell, edge,   cell, edge
 * Corner, edge, corner, edge, corner
 * Edge,   cell, edge,   cell, edge
 * Corner, edge, corner, edge, corner
 *
 * Each corner has a value of 0, 1, 2 (for the number of connections)
 * Each edge has a value of 0 or 1 (enabled or disabled)
 * Each cell has a value of 0 or an object (if it has an element)
 **/

// Returns a random integer in [0, n)
function _randint(n) {
  return Math.floor(Math.random()*n)
}

// Returns a new copy of a puzzle, since javascript is pass-by-reference.
function _copy(puzzle) {
  var new_grid = []
  for (var x=0; x<puzzle.grid.length; x++) {
    new_grid[x] = puzzle.grid[x].slice()
  }
  return {
    'grid':new_grid,
    'start':{'x':puzzle.start.x, 'y':puzzle.start.y},
    'end':{'x':puzzle.end.x, 'y':puzzle.end.y},
    'dots':puzzle.dots.slice()
  }
}

// Generates a random puzzle for a given size.
function _randomize(width, height) {
  var grid = []
  for (var i=0; i<width; i++) {
    grid[i] = []
    for (var j=0; j<height; j++) {
      grid[i][j] = 0
    }
  }

  // Both start and end must be on corners
  var start = {'x':2*_randint(width/2), 'y':2*_randint(height/2)}
  var end = {}
  switch (_randint(4)) {
    case 0:
      end.x = 0
      end.y = 2*_randint(height/2)
      break;
    case 1:
      end.x = 2*_randint(height/2)
      end.y = 0
      break;
    case 2:
      end.x = width-1
      end.y = 2*_randint(height/2)
      break;
    case 3:
      end.x = 2*_randint(height/2)
      end.y = height-1
      break;
  }

  // Dots must be on edges or corners
  var dots = []
  var numDots = _randint(width/2)
  for (var i=0; i<numDots; i++) {
    var x = _randint(width)
    if (x%2 == 0) {
      dots.push({'x':x, 'y':_randint(height)})
    } else {
      dots.push({'x':x, 'y':2*_randint(width/2)})
    }
  }

  for (var x=1; x<width; x+=2) {
    for (var y=1; y<height; y+=2) {
      if (_randint(100) > 70) { // 70% empty space
        var color = ['red', 'blue', 'green', 'orange'][Math.floor(Math.random()*2)]
        grid[x][y] = {'type':'square', 'color':color}
      }
    }
  }
  grid[1][1] = {'type':'poly', 'shape':'2.0.0'}
  return {'grid':grid, 'start':start, 'end':end, 'dots':dots}
}

function generatePuzzle(width, height) {
  var solutions
  while (true) {
    solutions = []
    var puzzle = _randomize(width, height)
    solve(puzzle, puzzle.start, solutions, [false])
    if (solutions.length == 0) {
      continue
    } else if (solutions.length == 1) {
      break // Unique solution, valid puzzle
    } else {
      break // Multiple solutions, force only one via dots & breaks
    }
  }
  draw(solutions[0])
}