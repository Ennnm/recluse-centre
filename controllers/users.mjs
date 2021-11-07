import * as validation from './validation.mjs';
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

  const update = async (request, response) => {
    const userInfo = request.body;
    const validatedUserSettings = validation.validateUserSettings(userInfo);
    const invalidRequests = util.getInvalidFormRequests(validatedUserSettings);
    try {
      if (invalidRequests.length > 0) {
        throw new Error(globals.INVALID_SETTINGS_REQUEST_MESSAGE);
      }

      const nameFmt = validatedUserSettings.realName.trim().replace(/\s+/g, ' ');
      const { username, description } = validatedUserSettings;
      const userId = request.params.id;

      let user = await db.User.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error(globals.SETTINGS_USER_NO_EXIST_ERROR_MESSAGE);
      }

      user = user.dataValues;

      const toUpdateUser = {
        ...user,
        username,
        realName: nameFmt,
        description,
        updatedAt: new Date(),
      };

      let updatedUser = await db.User.update(
        toUpdateUser,
        {
          where: { id: userId },
          returning: true,
        },
      );

      updatedUser = updatedUser[1][0].dataValues;

      const successMessage = 'You have changed your profile successfully!';

      // generate a hashed cookie string using SHA object
      const hashedCookieString = util.getHash(updatedUser.id);
      const hashedRealnameString = util.getHash(updatedUser.realName);
      const hashedUsernameString = util.getHash(updatedUser.username);
      response.cookie('loggedIn', hashedCookieString);
      response.cookie('userId', updatedUser.id);
      response.cookie('username', updatedUser.username);
      response.cookie('description', updatedUser.description);
      response.cookie('userSession', hashedUsernameString);
      response.cookie('realName', updatedUser.realName);
      response.cookie('session', hashedRealnameString);

      const obj = {
        id: updatedUser.id,
        message: successMessage,
        username: updatedUser.username,
        realName: updatedUser.realName,
        description: updatedUser.description,
      };

      response.send(obj);
    } catch (error) {
      let errorMessage = '';
      if (error.message === globals.INVALID_SETTINGS_REQUEST_MESSAGE) {
        errorMessage = 'There has been an error. Settings input validation failed!';
      } else {
        errorMessage = error.message;
      }

      const resObj = {
        error: errorMessage,
        message: errorMessage,
        ...validatedUserSettings,
      };
      delete resObj.password;
      response.send(resObj);
    }
  };

  return {
    show,
    update,
  };
}
