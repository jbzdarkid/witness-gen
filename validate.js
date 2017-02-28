// Provides the isValid(grid) method for validating a puzzle solution.

// Validates that the current grid state constitutes a solution.
function isValid() {
  console.log('Validating grid')
  // Check that start and end are well defined, with the end on an edge and the start distinct from the end

  // Check that all corners are either unused (0) or traversed (2)
  // Except for the start and end, which must be half-used (1)
  for (var i=0; i<grid.length; i+=2) {
    for (var j=0; j<grid[i].length; j+=2) {
      if (i == start[0] && j == start[1]) {
        if (grid[i][j] != 1) {
          console.log('Start invalid')
          return false
        }
      } else if (i == end[0] && j == end[1]) {
        if (grid[i][j] != 1) {
          console.log('End invalid')
          return false
        }
      } else if (grid[i][j] != 0 && grid[i][j] != 2) {
        console.log('Corner grid['+i+']['+j+'] invalid')
        return false
      }
    }
  }
  // Check that all horizontal edges are unused (0) or traversed (1)
  for (var i=0; i<grid.length; i+=2) {
    for (var j=1; j<grid[i].length; j+=2) {
      if (grid[i][j] != 0 && grid[i][j] != 1) {
        console.log('Horizontal edge grid['+i+']['+j+'] invalid')
        return false
      }
    }
  }
  // Check that all vertical edges are unused (0) or traversed (1)
  for (var i=1; i<grid.length; i+=2) {
    for (var j=2; j<grid[i].length; j+=2) {
      if (grid[i][j] != 0 && grid[i][j] != 1) {
        console.log('Vertical edge grid['+i+']['+j+'] invalid')
        return false
      }
    }
  }
  // Check that all dots are covered
  // FIXME: I'm not currently checking for invalid dot placements.
  for (var i=0; i<dots.length; i++) {
    if (grid[dots[i][0]][dots[i][1]] == 0) {
      console.log('Dot at grid['+dots[i][0]+']['+dots[i][1]+'] is not covered')
      return false
    }
  }
  // Check that individual regions are valid
  regions = _getRegions(grid)
  for (var i=0; i<regions.length; i++) {
    if (!_regionCheck(grid, regions[i])) {
      console.log("Failed for region "+i)
      return false
    }
  }
  // All checks passed
  console.log('Grid valid')
  return true
}

// Returns the contiguous regions on the grid. This is sized to the base grid
// because it only refers to the cells, not the corners or edges.
function _getRegions(grid) {
  var colors = []
  for (var i=0; i<grid.length; i++) {
    colors[i] = []
    for (var j=0; j<grid[i].length; j++) {
      colors[i][j] = 0
    }
  }

  var regions = []
  var unvisited = [[1, 1]]
  var localRegion = []

  while (unvisited.length > 0) {
    regions[regions.length] = []
    localRegion.push(unvisited.pop())
    while (localRegion.length > 0) {
      var cell = localRegion.pop()
      if (colors[cell[0]][cell[1]] != 0) {
        continue
      } else {
        colors[cell[0]][cell[1]] = regions.length
        regions[regions.length-1].push(cell)
      }
      if (cell[0] < colors.length-2 && colors[cell[0]+2][cell[1]] == 0) {
        if (grid[cell[0]+1][cell[1]] == 0) {
          localRegion.push([cell[0]+2, cell[1]])
        } else {
          unvisited.push([cell[0]+2, cell[1]])
        }
      }
      if (colors[cell[0]][cell[1]+2] == 0) {
      // if (cell[1] < colors[cell[0]].length-2 && colors[cell[0]][cell[1]+2] == 0) {
        if (grid[cell[0]][cell[1]+1] == 0) {
          localRegion.push([cell[0], cell[1]+2])
        } else {
          unvisited.push([cell[0], cell[1]+2])
        }
      }
      if (cell[0] > 1 && colors[cell[0]-2][cell[1]] == 0) {
        if (grid[cell[0]-1][cell[1]] == 0) {
          localRegion.push([cell[0]-2, cell[1]])
        } else {
          unvisited.push([cell[0]-2, cell[1]])
        }
      }
      if (cell[1] > 1 && colors[cell[0]][cell[1]-2] == 0) {
        if (grid[cell[0]][cell[1]-1] == 0) {
          localRegion.push([cell[0], cell[1]-2])
        } else {
          unvisited.push([cell[0], cell[1]-2])
        }
      }
    }
  }

  console.log('Computed region map, colors:')
  console.log(colors)
  return regions
}

// Checks if a region (series of cells) is valid.
// FIXME: Ideally, this encapsulates to not need to know about the grid.
function _regionCheck(grid, region) {
  // Check that squares are separated
  var squares = {}
  for (var i=0; i<region.length; i++) {
    var cell = grid[region[i][0]][region[i][1]]
    if (cell != 0) {
      if (cell['type'] == 'square') {
        if (squares[cell['color']] === undefined) {
          squares[cell['color']] = 0
        }
        squares[cell['color']]++
      }
    }
  }
  if (Object.keys(squares).length > 1) {
    console.log('Region has squares of different colors', squares)
    return false
  }
  return true
}