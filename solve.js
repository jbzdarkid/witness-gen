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

// Generates a solution via recursive backtracking
function solve(puzzle, pos, solutions, hasSolution) {
  if (hasSolution[0]) return
  var ret = isValid(puzzle)
  if (ret == 0 && !(pos.x == puzzle.end.x && pos.y == puzzle.end.y)) { // Solution still possible, recurse
    if (pos.x < puzzle.grid.length-1 && puzzle.grid[pos.x+2][pos.y] == 0) {
      var new_puzzle = _copy(puzzle)
      new_puzzle.grid[pos.x+0][pos.y]++
      new_puzzle.grid[pos.x+1][pos.y]++
      new_puzzle.grid[pos.x+2][pos.y]++
      solve(new_puzzle, {'x':pos.x+2, 'y':pos.y}, solutions, hasSolution)
    }
    if (pos.y < puzzle.grid[pos.x].length-1 && puzzle.grid[pos.x][pos.y+2] == 0) {
      var new_puzzle = _copy(puzzle)
      new_puzzle.grid[pos.x][pos.y+0]++
      new_puzzle.grid[pos.x][pos.y+1]++
      new_puzzle.grid[pos.x][pos.y+2]++
      solve(new_puzzle, {'x':pos.x, 'y':pos.y+2}, solutions, hasSolution)
    }
    if (pos.x > 0 && puzzle.grid[pos.x-2][pos.y] == 0) {
      var new_puzzle = _copy(puzzle)
      new_puzzle.grid[pos.x-0][pos.y]++
      new_puzzle.grid[pos.x-1][pos.y]++
      new_puzzle.grid[pos.x-2][pos.y]++
      solve(new_puzzle, {'x':pos.x-2, 'y':pos.y}, solutions, hasSolution)
    }
    if (pos.y > 0 && puzzle.grid[pos.x][pos.y-2] == 0) {
      var new_puzzle = _copy(puzzle)
      new_puzzle.grid[pos.x][pos.y-0]++
      new_puzzle.grid[pos.x][pos.y-1]++
      new_puzzle.grid[pos.x][pos.y-2]++
      solve(new_puzzle, {'x':pos.x, 'y':pos.y-2}, solutions, hasSolution)
    }
  } else if (ret == 2) { // Solution found
    hasSolution[0] = true
    solutions.push(puzzle)
  }
}
