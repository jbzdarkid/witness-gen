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
  for (var i=0; i<_randint(width); i++) {
    if (_randint(2) == 0) {
      dots.push({'x':2*_randint(width/2)+1, 'y':2*_randint(height/2)})
    } else {
      dots.push({'x':2*_randint(width/2), 'y':2*_randint(height/2)+1})
    }

  }

  for (var x=1; x<width; x+=2) {
    for (var y=1; y<height; y+=2) {
      if (_randint(100) > 90) { // 90% empty space
        var color = ['white', 'black'][Math.floor(Math.random()*2)]
        grid[x][y] = {'type':'square', 'color':color}
      }
    }
  }
  return {'grid':grid, 'start':start, 'end':end, 'dots':dots}
}

var limit = 100
var solutions = []
// Generates a solution via recursive backtracking
function _solve(puzzle, pos) {
  console.log(limit)
  limit--
  if (limit < 0) return
  var ret = isValid(puzzle)
  console.log("grid:")
  console.log(""+puzzle.grid[0])
  console.log(""+puzzle.grid[1])
  console.log(""+puzzle.grid[2])
  console.log("pos: "+pos.x+" "+pos.y)
  if (ret == 0) { // Solution still possible, recurse
    if (pos.x < puzzle.grid.length-1 && puzzle.grid[pos.x+2][pos.y] < 2) {
      puzzle.grid[pos.x+1] = puzzle.grid[pos.x+1].slice()
      puzzle.grid[pos.x+2] = puzzle.grid[pos.x+2].slice()
      puzzle.grid[pos.x+0][pos.y]++
      puzzle.grid[pos.x+1][pos.y]++
      puzzle.grid[pos.x+2][pos.y]++
      _solve(puzzle, {'x':pos.x+2, 'y':pos.y})
    }
    if (pos.y < puzzle.grid[pos.x].length-1 && puzzle.grid[pos.x][pos.y+2] < 2) {
      puzzle.grid[pos.x] = puzzle.grid[pos.x].slice()
      puzzle.grid[pos.x][pos.y+0]++
      puzzle.grid[pos.x][pos.y+1]++
      puzzle.grid[pos.x][pos.y+2]++
      _solve(puzzle, {'x':pos.x, 'y':pos.y+2})
    }
    if (pos.x > 0 && puzzle.grid[pos.x-2][pos.y] < 2) {
      puzzle.grid[pos.x-1] = puzzle.grid[pos.x-1].slice()
      puzzle.grid[pos.x-2] = puzzle.grid[pos.x-2].slice()
      puzzle.grid[pos.x-0][pos.y]++
      puzzle.grid[pos.x-1][pos.y]++
      puzzle.grid[pos.x-2][pos.y]++
      _solve(puzzle, {'x':pos.x-2, 'y':pos.y})
    }
    if (pos.y > 0 && puzzle.grid[pos.x][pos.y-2] < 2) {
      puzzle.grid[pos.x] = puzzle.grid[pos.x].slice()
      puzzle.grid[pos.x][pos.y-0]++
      puzzle.grid[pos.x][pos.y-1]++
      puzzle.grid[pos.x][pos.y-2]++
      _solve(puzzle, {'x':pos.x, 'y':pos.y-2})
    }
  } else if (ret == 1) { // No solution possible, backtrack
    return
  } else if (ret == 2) {
    solutions.append(puzzle.grid)
    return
  }
}

function generatePuzzle(width, height) {
  while (true) {
    var puzzle = _randomize(width, height)
    console.log(puzzle)
    solutions = []
    _solve(puzzle, puzzle.start)
    break
    if (solutions.length == 0) {
      continue // No solutions, generate another
    } else if (solutions.length == 1) {
      return puzzle // Unique solution, valid puzzle
    } else {
      // Computer differences of solutions, and force only one via dots
    }
  }
}