// Provides the isValid() method for validating a puzzle solution.

// Puzzle = {grid, start, end, dots}
// Determines if the current grid state is solvable.
// Returns 0 if the grid is potentially solvable, but not currently solved
// Returns 1 if the grid is unsolvable
// Returns 2 if the grid is solved
function isValid(puzzle) {
  // console.log('Validating', puzzle)
  // Check that start and end are well defined, with the end on an edge and the start distinct from the end
  if (puzzle.end.x != 0 && puzzle.end.x != puzzle.grid.length-1) {
    if (puzzle.end.y != 0 && puzzle.end.y != puzzle.grid[puzzle.end.x].length-1) {
      console.log('End point not on an edge')
      return 1
    }
  }
  if (puzzle.start.x == puzzle.end.x && puzzle.start.y == puzzle.end.y) {
    console.log('Start and end points not distinct')
    return 1
  }

  // Check that all corners are either unused (0) or traversed (2)
  // Except for the start and end, which must be half-used (1)
  for (var x=0; x<puzzle.grid.length; x+=2) {
    for (var y=0; y<puzzle.grid[x].length; y+=2) {
      if (x == puzzle.start.x && y == puzzle.start.y) {
        if (puzzle.grid[x][y] > 1) {
          console.log('Start overfull')
          return 1
        } else if (puzzle.grid[x][y] == 0) {
          // console.log('Start underfull')
          return 0
        }
      } else if (x == puzzle.end.x && y == puzzle.end.y) {
        if (puzzle.grid[x][y] > 1) {
          console.log('End overfull')
          return 1
        } else if (puzzle.grid[x][y] == 0) {
          // console.log('End underfull')
          return 0
        }
      } else if (puzzle.grid[x][y] > 2) {
        console.log('Corner grid['+x+']['+y+'] overfull')
        return 1
      } else if (puzzle.grid[x][y] == 1) {
        // console.log('Corner grid['+x+']['+y+'] underfull')
        return 0
      }
    }
  }
  // Check that all horizontal edges are unused (0) or traversed (1)
  for (var x=0; x<puzzle.grid.length; x+=2) {
    for (var y=1; y<puzzle.grid[x].length; y+=2) {
      if (puzzle.grid[x][y] > 1) {
        console.log('Horizontal edge grid['+x+']['+y+'] overfull')
        return 1
      }
    }
  }
  // Check that all vertical edges are unused (0) or traversed (1)
  for (var x=1; x<puzzle.grid.length; x+=2) {
    for (var y=0; y<puzzle.grid[x].length; y+=2) {
      if (puzzle.grid[x][y] > 1) {
        console.log('Vertical edge grid['+x+']['+y+'] overfull')
        return 1
      }
    }
  }
  // Check that all dots are covered
  // FIXME: I'm not currently checking for invalid dot placements.
  // FIXME: Code in such a way that this works with negation?
  for (var dot of puzzle.dots) {
    if (puzzle.grid[dot.x][dot.y] == 0) {
      // console.log('Dot at grid['+dot.x+']['+dot.y+'] is not covered')
      return 0
    }
  }
  // Check that individual regions are valid
  regions = _getRegions(puzzle.grid)
  for (var region of regions) {
    var ret = _regionCheck(puzzle.grid, region)
    if (ret == 0) {
      // console.log('Region', region, 'incomplete')
      return 0
    } else if (ret == 1) {
      console.log('Region', region, 'unsolvable')
      return 1
    }
  }
  // All checks passed
  console.log('Grid valid')
  return 2
}

// Returns the contiguous regions on the grid, as arrays of points.
// The return array may contain empty cells.
function _getRegions(grid) {
  var colors = []
  for (var x=0; x<grid.length; x++) {
    colors[x] = []
    for (var y=0; y<grid[x].length; y++) {
      colors[x][y] = 0
    }
  }

  var regions = []
  var unvisited = [{'x':1, 'y':1}]
  var localRegion = []

  while (unvisited.length > 0) {
    regions[regions.length] = []
    localRegion.push(unvisited.pop())
    while (localRegion.length > 0) {
      var cell = localRegion.pop()
      if (colors[cell.x][cell.y] != 0) {
        continue
      } else {
        colors[cell.x][cell.y] = regions.length
        regions[regions.length-1].push(cell)
      }
      if (cell.x < colors.length-2 && colors[cell.x+2][cell.y] == 0) {
        if (grid[cell.x+1][cell.y] == 0) {
          localRegion.push({'x':cell.x+2, 'y':cell.y})
        } else {
          unvisited.push({'x':cell.x+2, 'y':cell.y})
        }
      }
      if (cell.y < colors[cell.x].length-2 && colors[cell.x][cell.y+2] == 0) {
        if (grid[cell.x][cell.y+1] == 0) {
          localRegion.push({'x':cell.x, 'y':cell.y+2})
        } else {
          unvisited.push({'x':cell.x, 'y':cell.y+2})
        }
      }
      if (cell.x > 1 && colors[cell.x-2][cell.y] == 0) {
        if (grid[cell.x-1][cell.y] == 0) {
          localRegion.push({'x':cell.x-2, 'y':cell.y})
        } else {
          unvisited.push({'x':cell.x-2, 'y':cell.y})
        }
      }
      if (cell.y > 1 && colors[cell.x][cell.y-2] == 0) {
        if (grid[cell.x][cell.y-1] == 0) {
          localRegion.push({'x':cell.x, 'y':cell.y-2})
        } else {
          unvisited.push({'x':cell.x, 'y':cell.y-2})
        }
      }
    }
  }

  // console.log('Computed region map, colors:')
  // console.log(colors)
  return regions
}

// Checks if a region (series of cells) is valid.
// Matches the return style of isValid. In this case, a return value of 1
// means that adding more lines (subdividing the region) cannot solve
function _regionCheck(grid, region) {
  // Check that squares are separated
  var squares = {}
  var polys = []
  for (var pos of region) {
    var cell = grid[pos.x][pos.y]
    if (cell != 0) {
      if (cell.type == 'square') {
        if (squares[cell.color] === undefined) {
          squares[cell.color] = 0
        }
        squares[cell.color]++
      } else if (cell.type == 'poly') {
        polys.push(cell.shape)
      }
    }
  }
  if (Object.keys(squares).length > 1) {
    console.log('Region has squares of different colors', squares)
    return 0
  }
  var first = {'x':grid.length, 'y':grid[grid.length-1].length}
  var new_grid = []
  for (var x=0; x<grid.length; x++) {
    new_grid[x] = []
  }
  for (var cell of region) {
    new_grid[cell.x][cell.y] = 1
    if (cell.x <= first.x && cell.y < first.y) {
      first = {'x':cell.x, 'y':cell.y}
    }
  }
  if (_polyFit(polys, new_grid, first, [false]) == 1) {
    console.log('Region does not match polyomino shapes', polys)
    return 1
  }
  return 2
}

var POLY_DICT = {
  '1.0.0': [{'x':0, 'y':0}],
  '2.0.0': [{'x':0, 'y':0}, {'x':0, 'y':2}],
  '2.0.1': [{'x':0, 'y':0}, {'x':2, 'y':0}],
  '3.0.0': [{'x':0, 'y':0}, {'x':0, 'y':2}, {'x':0, 'y':4}],
  '3.0.1': [{'x':0, 'y':0}, {'x':2, 'y':0}, {'x':4, 'y':0}],
  '3.1.0': [{'x':0, 'y':0}, {'x':0, 'y':2}, {'x':2, 'y':2}],
  '3.1.1': [{'x':0, 'y':0}, {'x':2, 'y':0}, {'x':2, 'y':-2}],
  '3.1.2': [{'x':0, 'y':0}, {'x':2, 'y':0}, {'x':2, 'y':2}],
  '3.1.3': [{'x':0, 'y':0}, {'x':0, 'y':2}, {'x':2, 'y':0}],
}

function _polyFit(polys, grid, first, solutionFound) {
  // FIXME: Blue polys here
  if (polys.length == 0) {
    return 2
  }
  var allPolysPlaced = true
  for (var i in polys) {
    var poly = polys[i]
    if (poly == undefined) {
      continue // Poly already placed in the grid
    } else {
      allPolysPlaced = false
    }
    var polyCells = POLY_DICT[poly]
    var pieceFits = true
    // Attempt to remove the poly from the region
    var j=0
    for (; j<polyCells.length; j++) {
      var cell = polyCells[j]
      if (grid[cell.x+first.x] != undefined && grid[cell.x+first.x][cell.y+first.y] != undefined) {
        grid[cell.x+first.x][cell.y+first.y] = undefined
      } else {
        pieceFits = false
        break
      }
    }
    if (pieceFits) {
      // Recalculate first empty cell
      var new_first = {'x':first.x, 'y':first.y}
      for (var x=0; x<grid.length; x++) {
        for (var y=0; y<grid[x].length; y++) {
          if (x <= first.x && y < first.y) {
            new_first = {'x':x, 'y':y}
          }
        }
      }
      polys[i] = undefined // Remove the placed poly
      _polyFit(polys, grid, new_first, solutionFound) // Recurse
      polys[i] = poly // Replace the poly
    }
    // Refill the grid
    for (j--; j>=0; j--) { // Initially decrease by 1 since the loop exits at polyCells.length, or the piece was invalid
      var cell = polyCells[j]
      grid[cell.x+first.x][cell.y+first.y] = 1
    }
  }
  if (solutionFound[0]) {
    return 2 // A solution has already been found, stop searching.
  }
  if (allPolysPlaced) {
    var validSolution = true
    for (var x=0; x<grid.length; x++) {
      for (var y=0; y<grid[x].length; y++) {
        if (grid[x][y] != undefined) {
          validSolution = false
        }
      }
    }
    if (validSolution) {
      solutionFound[0] = true
      return 2
    }
  }
  return 1 // Tail recursion
}
