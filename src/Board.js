import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";
import _ from "lodash";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=3, ncols=3, chanceLightStartsOn=0.25 }) {
  const [board, setBoard] = useState(createBoard());

  console.log("Board rendered");
  console.log('new board:', board);

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    // TODO: create array-of-arrays of true/false values
    return Array.from({length: nrows}).map(
      row => Array.from({length: ncols}).map(
          cell => Math.random() < chanceLightStartsOn
      )
  );



    // old code for ref:
    // let initialBoard = [];
    // for (let y = 0; y < nrows.length; y++) {
    //   const row = [];
    //   for (let x = 0; x < ncols.length; x++) {
    //     row.push(null);
    //     const chance = Math.random();
    //     if (chance < chanceLightStartsOn) {
    //       initialBoard[y][x] = true;
    //     } else {
    //       initialBoard[y][x] = false;
    //     }
    //   }
    //   initialBoard.push(row);
    // }
    // return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    return board.every(row => row.every(cell => cell === false));

    // old code for ref:
    // if (initialBoard.every(row => row.every(cell => cell === false))) {
    //   return "You won!";
    // } else {
    //   return "Nothing yet.";
    // }
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard

      // Using lodash:
      // const oldBoardCopy = _.cloneDeep(oldBoard);

      // Alternatively w/out using additional libraries:
      const boardCopy = oldBoard.map(row => [...row]);

      // TODO: in the copy, flip this cell and the cells around it

      flipCell(y, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);

      // TODO: return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>You win!</div>
  }

  // TODO: make table board: rows of Cell components (the actual render)

  const tblBoard = [];

  for (let y = 0; y < nrows; y++) {
    const row = [];
    for (let x = 0; x < ncols; x++) {
      const coord = `${y}-${x}`;
      row.push(
        <Cell
            key={coord}
            isLit={board[y][x]}
            flipCellsAroundMe={evt => flipCellsAround(coord)}
            // this is passing a callback fn to ^ Cell component as a prop
        />
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>)
  }

  return (
    <table className="Board">
      <tbody>{tblBoard}</tbody>
    </table>
  );
}

export default Board;
