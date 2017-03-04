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
  var end = {'x':2*_randint(width/2), 'y':2*_randint(height/2)}

  // Dots must be on edges or corners
  var dots = []
  var numDots = _randint(width)
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
      if (_randint(100) > 50) { // 90% empty space
        var color = ['white', 'black'][Math.floor(Math.random()*2)]
        grid[x][y] = {'type':'square', 'color':color}
      }
    }
  }
  return {'grid':grid, 'start':start, 'end':end, 'dots':dots}
}

var solutions = []
// Generates a solution via recursive backtracking
function _solve(puzzle, pos) {
  if (solutions.length > 0) return
  var ret = isValid(puzzle)
  if (ret == 0) { // Solution still possible, recurse
    if (pos.x < puzzle.grid.length-1 && puzzle.grid[pos.x+2][pos.y] == 0) {
      var new_puzzle = _copy(puzzle)
      new_puzzle.grid[pos.x+0][pos.y]++
      new_puzzle.grid[pos.x+1][pos.y]++
      new_puzzle.grid[pos.x+2][pos.y]++
      _solve(new_puzzle, {'x':pos.x+2, 'y':pos.y})
    }
    if (pos.y < puzzle.grid[pos.x].length-1 && puzzle.grid[pos.x][pos.y+2] == 0) {
      var new_puzzle = _copy(puzzle)
      new_puzzle.grid[pos.x][pos.y+0]++
      new_puzzle.grid[pos.x][pos.y+1]++
      new_puzzle.grid[pos.x][pos.y+2]++
      _solve(new_puzzle, {'x':pos.x, 'y':pos.y+2})
    }
    if (pos.x > 0 && puzzle.grid[pos.x-2][pos.y] == 0) {
      var new_puzzle = _copy(puzzle)
      new_puzzle.grid[pos.x-0][pos.y]++
      new_puzzle.grid[pos.x-1][pos.y]++
      new_puzzle.grid[pos.x-2][pos.y]++
      _solve(puzzle, {'x':pos.x-2, 'y':pos.y})
    }
    if (pos.y > 0 && puzzle.grid[pos.x][pos.y-2] == 0) {
      var new_puzzle = _copy(puzzle)
      new_puzzle.grid[pos.x][pos.y-0]++
      new_puzzle.grid[pos.x][pos.y-1]++
      new_puzzle.grid[pos.x][pos.y-2]++
      _solve(new_puzzle, {'x':pos.x, 'y':pos.y-2})
    }
  } else if (ret == 2) { // Solution found
    solutions.push(puzzle)
    return
  }
}

function generatePuzzle(width, height) {
  solutions = []
  while (true) {
    var puzzle = _randomize(width, height)
    _solve(puzzle, puzzle.start)
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