import axios from 'axios';

export function setWorldFromId(setWorldProperties, id = 1) {
  axios
    .get(`/world/${id}`)
    .then((result) => {
      console.log('result from world :>> ', result.data);
      const world = result.data;
      setWorldProperties(world);
    })
    .catch((e) => {
      console.log(`error getting world: ${id}`, e);
    });
}

export function updateWorldInDb(id, worldState) {
  axios
    .put(`/world/${id}/edit`, { worldState })
    .then((result) => {
      console.log('uploaded world', result);
    })
    .catch((error) => {
      console.log('error in uploading world :>> ', error);
    });
}

export const setWorldProperties = (world, setBackgrndArr, setWorld) => {
  const { id, userId, name, worldState } = world;
  const { board, activeObjCells, roomCells, wallCells } = worldState;
  worldId.current = id;
  worldName.current = name;
  // setWorldName(name);
  setBackgrndArr(board);
  setWorld(worldState);
};