function newGrid(width, height) {
  var grid = []
  for (var i=0; i<width; i++) {
    grid[i] = []
    for (var j=0; j<height; j++) {
      grid[i][j] = 0
    }
  }
  return grid
}

function test0() {
  var grid = newGrid(3, 7)
  grid[1][1] = {'type':'nega', 'color':'white'}
  grid[1][3] = {'type':'square', 'color':'red'}
  grid[1][5] = {'type':'square', 'color':'blue'}
  return {'grid':grid, 'start':{'x':2, 'y':0}, 'end':{'x':2, 'y':6}, 'dots':[]}
}

function test1() {
  var grid = newGrid(7, 7)
  grid[1][5] = {'type':'nega', 'color':'white'}
  grid[5][5] = {'type':'nega', 'color':'white'}
  grid[1][1] = {'type':'square', 'color':'red'}
  grid[1][3] = {'type':'square', 'color':'blue'}
  grid[5][3] = {'type':'poly', 'shape':'1.0.0'}
  return {'grid':grid, 'start':{'x':6, 'y':0}, 'end':{'x':0, 'y':0}, 'dots':[]}
}

function test2() {
  var grid = newGrid(7, 7)
  grid[1][1] = {'type':'nega', 'color':'white'}
  grid[1][3] = {'type':'nega', 'color':'white'}
  grid[3][1] = {'type':'square', 'color':'red'}
  grid[3][3] = {'type':'square', 'color':'blue'}
  grid[3][5] = {'type':'square', 'color':'blue'}
  return {'grid':grid, 'start':{'x':6, 'y':0}, 'end':{'x':6, 'y':6}, 'dots':[]}
}

function test3() {
  var grid = newGrid(7, 7)
  grid[1][1] = {'type':'nega', 'color':'white'}
  grid[1][3] = {'type':'nega', 'color':'white'}
  grid[3][1] = {'type':'square', 'color':'red'}
  grid[3][3] = {'type':'square', 'color':'blue'}
  grid[3][5] = {'type':'square', 'color':'blue'}
  return {'grid':grid, 'start':{'x':6, 'y':0}, 'end':{'x':6, 'y':6}, 'dots':[{'x':2, 'y':2}]}
}

function test4() {
  console.clear()
  var grid = newGrid(7, 7)
  grid[1][1] = {'type':'poly', 'shape':'1.0.0'}
  grid[1][3] = {'type':'poly', 'shape':'2.0.0'}
  return {'grid':grid, 'start':{'x':6, 'y':0}, 'end':{'x':6, 'y':6}, 'dots':[]}
}

function generatePuzzle() {
  for (var i=0; i<8; i++) {
    try {
      var puzzle = eval('test'+i+'()')
    } catch (e) {
      continue
    }
    var solutions = []
    solve(puzzle, puzzle.start, solutions, [false])
    draw(solutions[0], 'test'+i)
  }
}