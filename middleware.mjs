// CUSTOM IMPORTS
import { getHash } from './controllers/utils.mjs';

const expireSession = (response) => {
  response.clearCookie('userId');
  response.clearCookie('loggedIn');
  response.clearCookie('username');
  response.clearCookie('userSession');
  response.clearCookie('realName');
  response.clearCookie('session');
  response.redirect('/sessionexpired');
};

const auth = (db) => async (request, response, next) => {
  // set the default value
  request.isUserLoggedIn = false;
  const cookies = [];

  if (request.cookies.loggedIn) {
    cookies.push(request.cookies.loggedIn);
  }
  if (request.cookies.userId) {
    cookies.push(request.cookies.userId);
  }
  if (request.cookies.username) {
    cookies.push(request.cookies.username);
  }
  if (request.cookies.userSession) {
    cookies.push(request.cookies.userSession);
  }
  if (request.cookies.realName) {
    cookies.push(request.cookies.realName);
  }
  if (request.cookies.session) {
    cookies.push(request.cookies.session);
  }

  // check to see if the cookies you need exists
  if (cookies.length === 6) {
    // get the hashed value that should be inside the cookie
    const hash = getHash(request.cookies.userId);
    const hashedUsername = getHash(request.cookies.username);
    const { realName } = request.cookies;
    const realNameSpaced = (typeof request.cookies.realName === 'string') ? request.cookies.realName.split('%20').join(' ') : realName;
    const hashedRealname = getHash(realNameSpaced);

    // test the value of the cookie
    if (
      request.cookies.loggedIn === hash
      && request.cookies.userSession === hashedUsername
      && request.cookies.session === hashedRealname
    ) {
      request.isUserLoggedIn = true;

      // look for this user in the database
      const user = await db.User.findOne({
        where: {
          [db.Sequelize.Op.and]: [
            { id: request.cookies.userId },
            { realName: realNameSpaced },
            { username: request.cookies.username },
          ],
        },
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        expireSession(response);
        return;
      }

      // set the user as a key in the request object so that it's accessible in the route
      request.user = user.dataValues;
      next();

      // make sure we don't get down to the next() below
      return;
    }

    expireSession(response);
    return;
  }

  if (cookies.length !== 0) {
    expireSession(response);
    return;
  }

  next();
};

export default auth;
