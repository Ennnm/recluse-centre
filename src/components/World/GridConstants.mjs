export const numCols = 40;
export const numRows = 60;

export const Tile = {
  empty: 0,
  room: 1,
  wall: 2,
  activeObj: 3,
};

export function Wall(x, y, color, charFill) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.charFill = charFill;
}

export function Room(x, y, id, name) {
  this.x = x;
  this.y = y;
  // use room id or a name, if using a name reference the db
  this.name = name;
  this.id = id;
}
export function ActiveObj(x, y, url, type) {
  this.x = x;
  this.y = y;
  this.url = url;
  this.type = type;
  // render different icons based on type
}

export function genGridArray(fill = null) {
  // TODO: fine tune sizing, size for tablet
  // nested arrays easier for checking adjacency vs using flat array
  const arr = [...Array(numRows)].map(() => Array(numCols).fill(fill));
  return arr;
}

export function WorldState() {
  this.board = genGridArray();
  this.wallCells = [];
  this.roomCells = [];
  this.activeObjCells = [];
}
export function rowFromIndex(i) {
  return Math.floor(i / numCols);
}
export function colFromIndex(i) {
  return i % numCols;
}
