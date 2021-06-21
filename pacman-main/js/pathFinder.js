// function removeFromArray(arr, elt)
// {
//   for (var i = arr.length - 1; i >=0; i--)
//   {
//     if (arr[i] == elt)
//     {
//       arr.splice(i, 1);
//     }
//   }
// }
//
// function heuristic(a, b)
// {
//   return abs(a.x - b.x) + abs(a.y - b.y);
// }
//
// function pathFinder(map, start, goal, scale = 1, draw = false, color = 'rgb(0%,100%,100%)')
// {
//   var openSet = [];
//   var closedSet = [];
//
//   var rows = map.getPlayfield().length;
//   var cols = map.getPlayfield()[0].length;
//   var offCenter = createVector(round(start.x), round(start.y)).sub(createVector((start.x), (start.y)));
//
//   // Create cost grid
//   grid = [];
//
//   for (var i = 0; i < cols; i++)
//   {
//     grid[i] = new Array(rows);
//   }
//
//   for (var i = 0; i < cols; i++)
//   {
//     for (var j = 0; j < rows; j++)
//     {
//       grid[i][j] = new Spot(i, j, scale, (map.getCellType(i, j) == 1));
//     }
//   }
//
//   for (var i = 0; i < cols; i++)
//   {
//     for (var j = 0; j < rows; j++)
//     {
//       grid[i][j].addNeighbors(grid, rows, cols);
//     }
//   }
//
//   openSet.push(grid[round(start.x)][round(start.y)]);
//
//   while (openSet.length > 0)
//   {
//     var winner = 0;
//     for (var i = 0; i < openSet.length; i++)
//     {
//       if (openSet[i].f < openSet[winner].f)
//       {
//         winner = i;
//       }
//     }
//
//     var current = openSet[winner];
//
//     if (current.x == goal.x && current.y == goal.y)
//     {
//       break;
//     }
//
//     removeFromArray(openSet, current);
//     closedSet.push(current);
//
//     for (var i = 0; i < current.neighbors.length; i++)
//     {
//       var neighbor = current.neighbors[i];
//
//       if (!closedSet.includes(neighbor))
//       {
//         var tempG = current.g + 1;
//
//         if (openSet.includes(neighbor))
//         {
//           if (tempG < neighbor.g)
//           {
//             neighbor.g = tempG;
//           }
//         }
//         else
//         {
//           neighbor.g = tempG;
//           openSet.push(neighbor);
//         }
//
//         neighbor.h = heuristic (neighbor, goal);
//         neighbor.f = neighbor.g + neighbor.h;
//         neighbor.previous = current;
//       }
//     }
//   }
//
//   path = [];
//   var temp = current ;
//   path.push(temp);
//   while (temp.previous)
//   {
//     path.push(temp.previous);
//     temp = temp.previous;
//   }
//
//   for (var i = 0; i < path.length; i++)
//   {
//     path[i].show(color);
//   }
//
//   //Return the direction to move next
//   var c = path.length;
//   if (c > 1)
//   {
//     return createVector(path[c-2].x - path[c-1].x, path[c-2].y - path[c-1].y);
//   }
//   else
//   {
//     return createVector(0, 0);
//   }
// }
