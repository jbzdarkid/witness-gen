function draw(puzzle, target='puzzle') {
  var table = document.getElementById(target)
  while (table.rows.length > 0) {
    table.deleteRow(0)
  }

  for (var x=0; x<puzzle.grid.length; x++) {
    var row = table.insertRow(x)
    for (var y=0; y<puzzle.grid[x].length; y++) {
      var cell = row.insertCell(y)
      cell.height = x%2 == 0 ? 22 : 50
      cell.width  = y%2 == 0 ? 22 : 50
      if (x%2 == 1 && y%2 == 1) {
        cell.style.background = '#000000'
      } else {
        cell.style.background = '#404040'
      }
      if (x == 0 && y == 0) {
        cell.style.borderTopLeftRadius = '10px'
      } else if (x == 0 && y == puzzle.grid[x].length-1) {
        cell.style.borderTopRightRadius = '10px'
      } else if (x == puzzle.grid.length-1 && y == 0) {
        cell.style.borderBottomLeftRadius = '10px'
      } else if (x == puzzle.grid.length-1 && y == puzzle.grid[x].length-1) {
        cell.style.borderBottomRightRadius = '10px'
      }
      cell.align = 'center'
      cell.id = target+'_'+x+'_'+y

      var div = document.createElement('div')
      div.align = 'center'
      if (puzzle.grid[x][y] > 0) {
        div.className = 'line'
        if (puzzle.grid[x][y] == 2) {
          if (x > 0 && puzzle.grid[x-1][y] == 1) {
            if (y > 0 && puzzle.grid[x][y-1] == 1) {
              div.style.borderBottomRightRadius = '10px'
            }
            if (y < puzzle.grid[x].length-1 && puzzle.grid[x][y+1] == 1) {
              div.style.borderBottomLeftRadius = '10px'
            }
          }
          if (x < puzzle.grid.length-1 && puzzle.grid[x+1][y] == 1) {
            if (y > 0 && puzzle.grid[x][y-1] == 1) {
              div.style.borderTopRightRadius = '10px'
            }
            if (y < puzzle.grid[x].length-1 && puzzle.grid[x][y+1] == 1) {
              div.style.borderTopLeftRadius = '10px'
            }
          }
        }
      }
      if (x == puzzle.start.x && y == puzzle.start.y) {
        div.className = 'start line'
      } else if (x == puzzle.end.x && y == puzzle.end.y) {
        if (y == 0) {
          div.className = 'end end-left line'
          if (x > 0 && puzzle.grid[x-1][y] == 1) {
            div.style.borderBottomRightRadius = '20px'
          } else if (x < puzzle.grid.length-1 && puzzle.grid[x+1][y] == 1) {
            div.style.borderTopRightRadius = '20px'
          }
        } else if (y == puzzle.grid[x].length-1) {
          div.className = 'end end-right line'
          if (x > 0 && puzzle.grid[x-1][y] == 1) {
            div.style.borderBottomLeftRadius = '20px'
          } else if (x < puzzle.grid.length-1 && puzzle.grid[x+1][y] == 1) {
            div.style.borderTopLeftRadius = '20px'
          }
        } else if (x == 0) {
          div.className = 'end end-top line'
          if (y > 0 && puzzle.grid[x][y-1] == 1) {
            div.style.borderBottomRightRadius = '20px'
          } else if (y < puzzle.grid[x].length-1 && puzzle.grid[x][y+1] == 1) {
            div.style.borderBottomLeftRadius = '20px'
          }
        } else if (x == puzzle.grid.length-1) {
          div.className = 'end end-bottom line'
          if (y > 0 && puzzle.grid[x][y-1] == 1) {
            div.style.borderTopRightRadius = '20px'
          } else if (y < puzzle.grid[x].length-1 && puzzle.grid[x][y+1] == 1) {
            div.style.borderTopLeftRadius = '20px'
          }
        }
      } else if (puzzle.grid[x][y].type == 'square') {
        var square = document.createElement('div')
        square.className = 'square'
        square.style.background = puzzle.grid[x][y].color
        div.appendChild(square)
      } else if (puzzle.grid[x][y].type == 'poly') {
        // FIXME: Real polyominos, somehow
        div.innerHTML = puzzle.grid[x][y].shape
        div.style.color = 'white'
      }
      cell.appendChild(div)
    }
  }
  for (var dot of puzzle.dots) {
    var cell = document.getElementById(target+'_'+dot.x+'_'+dot.y)
    var div = cell.childNodes[0]
    div.innerHTML = '\u2b22'
    div.style.fontSize = '16px'
  }
}