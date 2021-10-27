import axios from 'axios';

export const setWorldFromId = async (setWorldProperties, id = 1) => {
  await axios
    .get(`/world/${id}`)
    .then((result) => {
      console.log('result from world :>> ', result.data);
      const world = result.data;
      setWorldProperties(world);
    })
    .catch((e) => {
      console.log(`error getting world: ${id}`, e);
    });
};

export const updateWorldInDb = (id, worldState) => {
  axios
    .put(`/world/${id}/edit`, { worldState })
    .then((result) => {
      console.log('uploaded world', result);
    })
    .catch((error) => {
      console.log('error in uploading world :>> ', error);
    });
};
