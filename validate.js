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
  for (var region of _getRegions(puzzle.grid)) {
    if (!_regionCheck(puzzle.grid, region)) {
      console.log('Region', region, 'unsolvable')
      return 1
    }
  }
  // All checks passed
  console.log('Grid valid')
  return 2
}

function _combinations(grid, region) {
  var nega = 0
  for (var i=0; i<region.length; i++) {
    var pos = region[i]
    var cell = grid[pos.x][pos.y]
    if (cell != 0) {
      if (cell.type == 'nega') {
        nega = {'x':pos.x, 'y':pos.y, 'cell':cell, 'i':i}
        break
      }
    }
  }
  if (nega == 0) {
    return [[]]
  } else {
    region.splice(nega.i, 1)
    grid[nega.x][nega.y] = 0
    var combinations = []
    // For each element in the region
    for (var i=0; i<region.length; i++) {
      var pos = region[i]
      var cell = grid[pos.x][pos.y]
      if (cell != 0) {
        // Negate the item
        grid[pos.x][pos.y] = 0
        // Find all combinations of later items
        var new_region = region.slice()
        new_region.splice(i, 1)
        for (var comb of _combinations(grid, new_region)) {
          // Combine this negation with each later combination
          combinations.push([{
            'source':{'x':nega.x, 'y':nega.y, 'cell':nega.cell},
            'target':{'x':pos.x, 'y':pos.y, 'cell':cell}
          }].concat(comb))
        }
        // Undo the negation
        grid[pos.x][pos.y] = cell
      }
    }
    // Restore the negation element too
    region.splice(nega.i, 0, {'x':nega.x, 'y':nega.y})
    grid[nega.x][nega.y] = nega.cell
    return combinations
  }
}

// Checks if a region (series of cells) is valid.
// Since the path must be complete at this point, returns only true or false
function _regionCheck(grid, region) {
  var hasNega = false
  for (var i=0; i<region.length; i++) {
    var pos = region[i]
    var cell = grid[pos.x][pos.y]
    if (cell != 0 && cell.type == 'nega') {
      hasNega = true
      break
    }
  }
  if (hasNega) {
    // Get all possible ways of applying negations, and set a label to easily move on to the next one.
    var combinations = _combinations(grid, region)
    nextCombination: for (var combination of combinations) {
      // Make a copy of the grid and region with negation elements removed
      var new_grid = _copyGrid(grid)
      var new_region = region.slice()
      for (var negation of combination) {
        new_grid[negation.source.x][negation.source.y] = 0
        new_grid[negation.target.x][negation.target.y] = 0
        for (var i=0; i<new_region.length; i++) {
          if (new_region[i].x == negation.source.x &&
              new_region[i].y == negation.source.y) {
            new_region.splice(i, 1)
            i--
          } else if (new_region[i].x == negation.target.x &&
              new_region[i].y == negation.target.y) {
            new_region.splice(i, 1)
            i--
          }
        }
      }
      // Verify that the puzzle solves with negations applied
      if (!_regionCheck(new_grid, new_region)) {
        continue
      }
      // Verify that each negation is valid, i.e. removes an incorrect element
      for (var negation of combination) {
        new_grid[negation.target.x][negation.target.y] = negation.target.cell
        new_region.push({'x': negation.target.x, 'y':negation.target.y})
        var ret = _regionCheck(new_grid, new_region)
        new_grid[negation.target.x][negation.target.y] = 0
        new_region.pop()
        if (ret) {
          continue nextCombination
        }
      }
      // console.log('Valid negation: ', combination)
      return true
    }
    console.log('Unable to find valid negation but symbols exist')
    return false
  }

  // Count elements
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
    return false
  }

  if (polys.length > 0) {
    var first = {'x':grid.length-1, 'y':grid[grid.length-1].length}
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
    if (!_polyFit(polys, new_grid, first)) {
      console.log('Region does not match polyomino shapes', polys)
      return false
    }
  }
  return true
}

// FIXME: Blue polys somehow
function _polyFit(polys, grid, first) {
  // All polys placed, if grid is full then polys fit.
  if (polys.length == 0) {
    for (var x=1; x<grid.length; x+=2) {
      for (var y=1; y<grid.length; y+=2) {
        if (grid[x][y] != undefined) {
          console.log('All polys placed, but grid not full')
          return false
        }
      }
    }
    console.log('All polys placed, and grid full')
    return true
  }
  if (first == undefined) {
    console.log('Polys remaining but grid full')
    return false
  }
  nextPoly: for (var i=0; i<polys.length; i++) {
    var poly = polys.splice(i, 1)
    var polyCells = POLY_DICT[poly]
    var new_grid = _copyGrid(grid)

    for (var cell of polyCells) {
      if (new_grid[cell.x+first.x] != undefined && new_grid[cell.x+first.x][cell.y+first.y] != undefined) {
        new_grid[cell.x+first.x][cell.y+first.y] = undefined
      } else { // Poly didn't fit, restore the list and try the next one
        polys.splice(i, 0, poly)
        continue nextPoly
      }
    }

    // Poly placed, update first empty cell and recurse.
    var new_first
    firstLoop: for (var x=1; x<new_grid.length; x+=2) {
      for (var y=1; y<new_grid[x].length; y+=2) {
        if (new_grid[x][y] == 1) {
          new_first = {'x':x, 'y':y}
          break firstLoop
        }
      }
    }
    if (_polyFit(polys, new_grid, new_first)) {
      return true
    }
    // Restore list for the next poly choice
    polys.splice(i, 0, poly)
  }
  return false
}
