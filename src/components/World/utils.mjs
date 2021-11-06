export const numCols = 40;
export const numRows = 60;
export const indexNumCols = 34;
export const indexNumRows = 17;

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
export function ActiveObj(x, y, url, title = '') {
  this.x = x;
  this.y = y;
  this.url = url;
  this.title = title;
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
export function World(id = 0) {
  this.id = id;
  this.createdAt = '';
  this.name = '';
  this.updatedAt = '';
  this.userId = 0;
  this.worldState = new WorldState();
}
export function rowFromIndex(i) {
  return Math.floor(i / numCols);
}
export function colFromIndex(i) {
  return i % numCols;
}

export function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexPalette(numColors, saturation, lightness) {
  const colors = [];
  const hueInteval = Math.floor(360 / numColors);
  for (let i = 0; i < numColors; i += 1) {
    const hue = hueInteval * i;
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return colors;
}
export const tailWindCol400 = ['#9CA3AF', '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#818CF8', '#A78BFA', '#F472B6', ''];

export const tailWindCol200 = ['#E5E7EB', '#FECACA', '#FDE68A', '#A7F3D0', '#BFDBFE', '#C7D2FE', '#DDD6FE', '#FBCFE8', ''];

export function faviconFromSite(url) {
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
}
export function validURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}
