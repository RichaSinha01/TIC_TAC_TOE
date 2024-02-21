function Tile({ className, value, onClick, playerTurn }) {
  let hoverClass = null;
  if (value == null && playerTurn != null) {
    //check if the cell is empty or not and also check the playerturn is being set or not
    hoverClass = `${playerTurn.toLowerCase()}-hover`;
  }
  return (
    <div onClick={onClick} className={`tile ${className} ${hoverClass}`}>
      {value}
    </div>
  );
}

export default Tile;
