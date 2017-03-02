function draw(puzzle) {
  console.log('Drawing', puzzle)
  var table = document.getElementById('puzzle')
  while (table.rows.length > 0) {
    table.deleteRow(0)
  }

  for (var x=0; x<puzzle.grid.length; x++) {
    var row = table.insertRow(x)
    for (var y=0; y<puzzle.grid[x].length; y++) {
      var cell = row.insertCell(y)
      cell.height = x%2 == 0 ? 20 : 50
      cell.width  = y%2 == 0 ? 20 : 50
      cell.style.border = '1px solid black'
      cell.id = x+'_'+y
      if (x == puzzle.start.x && y == puzzle.start.y) {
        cell.innerHTML = 'S'
      }
      if (x == puzzle.end.x && y == puzzle.end.y) {
        cell.innerHTML = 'E'
      }
      if (puzzle.grid[x][y].type == 'square') {
        var square = document.createElement('div')
        square.width = '40'
        square.height = '40'
        cell.style.align = 'center'
        square.style.background = puzzle.grid[x][y].color
        cell.appendChild(square)
      }
      if (puzzle.grid[x][y] > 0) {
        cell.style.background = 'gray'
      }
    }
  }
}