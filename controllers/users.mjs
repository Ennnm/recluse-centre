import * as util from './utils.mjs';
import * as globals from '../globals.mjs';

export default function initUsersController(db) {
  const show = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await db.User.findByPk(id);

      if (!user) {
        throw new Error(globals.USER_NOT_FOUND);
      }
      console.log('user in controller :>> ', user);
      res.send(user);
    } catch (e) {
      util.checkError(e);
      res.status(500).send('error in getting user');
    }
  };

  return {
    show,
  };
}
