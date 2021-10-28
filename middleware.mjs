// CUSTOM IMPORTS
import { getHash } from './controllers/utils.mjs';

const expireSession = (response) => {
  response.clearCookie('userId');
  response.clearCookie('loggedIn');
  response.redirect('/sessionexpired');
};

const auth = (db) => async (request, response, next) => {
  // set the default value
  request.isUserLoggedIn = false;

  // check to see if the cookies you need exists
  if (request.cookies.loggedIn && request.cookies.userId) {
    // get the hashed value that should be inside the cookie
    const hash = getHash(request.cookies.userId);

    // test the value of the cookie
    if (request.cookies.loggedIn === hash) {
      request.isUserLoggedIn = true;

      // look for this user in the database
      const user = await db.User.findOne({
        where: {
          id: request.cookies.userId,
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

  next();
};

export default auth;
