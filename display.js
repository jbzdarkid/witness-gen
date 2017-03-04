function draw(puzzle) {
  var table = document.getElementById('puzzle')
  while (table.rows.length > 0) {
    table.deleteRow(0)
  }

  for (var x=0; x<puzzle.grid.length; x++) {
    var row = table.insertRow(x)
    for (var y=0; y<puzzle.grid[x].length; y++) {
      var cell = row.insertCell(y)
      cell.height = x%2 == 0 ? 25 : 50
      cell.width  = y%2 == 0 ? 25 : 50
      cell.style.border = '1px solid black'
      cell.align = 'center'
      cell.id = x+'_'+y
      if (x == puzzle.start.x && y == puzzle.start.y) {
        cell.innerHTML = 'S'
      } else if (x == puzzle.end.x && y == puzzle.end.y) {
        cell.innerHTML = 'E'
      } else if (puzzle.grid[x][y].type == 'square') {
        var square = document.createElement('div')
        square.className = 'square'
        square.style.background = puzzle.grid[x][y].color
        cell.appendChild(square)
      }
      if (puzzle.grid[x][y] > 0) {
        cell.style.background = 'gray'
      }
    }
  }
  for (var dot of puzzle.dots) {
    var cell = document.getElementById(dot.x+'_'+dot.y)
    cell.innerHTML = '\u2b22'
  }
}