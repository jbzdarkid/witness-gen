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

function randomize(width, height) {
  var grid = []
  for (var i=0; i<width; i++) {
    grid[i] = []
    for (var j=0; j<height; j++) {
      grid[i][j] = 0
    }
  }

  var start = [_randint(width), _randint(height)]
  var end = [_randint(width), _randint(height)]

  var dots = []
  for (var i=0; i<_randint(width); i++) {
    dots.append([_randint(width), _randint(height)])
  }

  for (var i=1; i<width; i+=2) {
    for (var j=1; j<height; j+=2) {
      if (_randint(100) > 90) { // 90% empty space
        var color = ['white', 'black'][Math.floor(Math.random()*2)]
        grid[i][j] = {'type':type, 'color':color}
      }
    }
  }
  return grid
}

while (True) {
  var test = randomize(3, 3)
  // attempt to solve
  // break if can be solved, return otherwise

}