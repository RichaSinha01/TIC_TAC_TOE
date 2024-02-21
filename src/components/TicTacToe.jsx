import { useEffect, useState } from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import gameOverSoundAsset from '../sounds/game_over.wav';
import clickSoundAsset from '../sounds/click.wav';

//Set volume of the audios
const gameOverSound = new Audio(gameOverSoundAsset)
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset)
clickSound.volume = 0.5;   

const PLAYER_X = "X";
const PLAYER_O = "O";

//We make an array which have all the winning combinations to choose the winner.  In this array we can define an object which contains all the winning combo

const winningCombinations = [
  //Rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" }, //it contains the index of the three child that we should check for winning combinations for the first row
  { combo: [3, 4, 5], strikeClass: "strike-row-2" }, //2nd row
  { combo: [6, 7, 8], strikeClass: "strike-row-3" }, //3rd row

  //Columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" }, //1st col
  { combo: [1, 4, 7], strikeClass: "strike-column-2" }, //2nd col
  { combo: [2, 5, 8], strikeClass: "strike-column-3" }, //3rd col

  //Diagonal
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" }, //1st Diagonal
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" }, //2nd diagonal
];

function checkWinner(tiles, setStrikeClass, setGameState) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      setStrikeClass(strikeClass);
      if(tileValue1 === PLAYER_X){
        setGameState(GameState.playerXWins);
      }
      else{
        setGameState(GameState.playerOWins);
      }
      return;
    }
  }

  //Check for the Game Draw condition
  const areAllTilesFilledIn = tiles.every((tile) => tile != null);
  if(areAllTilesFilledIn){
    setGameState(GameState.draw);
  }
}

function TicTacToe() {
  const [tiles, setTiles] = useState(Array(9).fill(null)); //Take the array of 9 elements and initially fill it to null
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(GameState.inProgress);

  //For Play Again Button
  const handleReset = ()=>{
      setGameState(GameState.inProgress);
      setTiles(Array(9).fill(null));  //Reset the tiles values by creating a new array with 9 elements and initially fill with null 
      setPlayerTurn(PLAYER_X);
      setStrikeClass(null);
  }

  //This arrow function is going to take an index to indicate which tile is being clicked
  const handleTileClick = (index) => {
    if(gameState !== GameState.inProgress){  //It will stop the further click in cell after winning
      return;
    }

    if (tiles[index] !== null) {
      //It will not allow the element to change after fill once
      return;
    }

    const newTiles = [...tiles]; //make the copy of tiles array
    newTiles[index] = playerTurn; //in newTiles array we send the index as a value of player's turn
    setTiles(newTiles); // update the tiles by using setTiles and give it the new list of tiles
    if (playerTurn === PLAYER_X) {
      setPlayerTurn(PLAYER_O);
    } else {
      setPlayerTurn(PLAYER_X);
    }
  };

  //Check for a WINNER
  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);


  //For Click Sound
  useEffect(() =>{
    if(tiles.some((tile) => tile !== null)){
        clickSound.play();
    }
  }, [tiles]);

  //For Game Over Sound
  useEffect(()=>{
    if(gameState !== GameState.inProgress){
      gameOverSound.play();
    }
  }, [gameState]);

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <Board
        playerTurn={playerTurn}
        tiles={tiles}
        onTileClick={handleTileClick}
        strikeClass={strikeClass}
      />
      <GameOver gameState = {gameState}/>
      <Reset gameState = {gameState} onReset = {handleReset}/>
    </div>
  );
}

export default TicTacToe;
