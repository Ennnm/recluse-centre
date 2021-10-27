// import pkg from 'sequelize';
import {
  WorldState,
} from '../src/components/World/GridConstants.mjs';
import { checkError } from './utils.mjs';

// const { Op } = pkg;

export default function initWorldsController(db) {
  const create = async (req, res) => {
    // or get it from cookies
    let { userId } = req.body;
    const { name } = req.body;

    userId = userId || 1;
    try {
      const newWorld = await db.World.create({
        createdUserId: userId,
        name,
        worldState: new WorldState(),
      });
      res.send(newWorld);
    } catch (error) {
      console.log('error in creating world');
      checkError(error);
      res.status(500).send({ error });
    }
  };

  const edit = async (req, res) => {
    const { worldState } = req.body;
    const { id } = req.params;
    try {
      const world = await db.World.findByPk(id);
      world.worldState = worldState;
      await world.save({ fields: ['worldState'] });
      await world.reload();
      res.send(world);
    } catch (error) {
      console.log('error in editing world');
      checkError(error);
      res.status(500).send({ error });
    }
  };
  const show = async (req, res) => {
    const { id } = req.params;
    try {
      const world = await db.World.findByPk(id);
      res.send(world);
    } catch (error) {
      console.log('error in finding world');
      checkError(error);
      res.status(500).send({ error });
    }
  };
  return {
    create,
    edit,
    show,

  };
}
