import { resolve } from 'path';
import db from './models/index.mjs';

import initWorldsController from './controllers/worlds.mjs';
import initSignupController from './controllers/signup.mjs';
import initLoginController from './controllers/login.mjs';
import initUsersController from './controllers/users.mjs';

export default function routes(app) {
  console.log('test');
  const worldController = initWorldsController(db);
  const SignupController = initSignupController(db);
  const LoginController = initLoginController(db);
  const UserController = initUsersController(db);

  // WORLD CONTROL
  app.get('/world/:id', worldController.show);
  app.put('/world/:id/edit', worldController.edit);
  app.post('/world', worldController.create);

  // USER CONTROL
  app.post('/signup', SignupController.create);
  app.post('/login', LoginController.create);
  app.delete('/logout', LoginController.destroy);

  app.get('/user/:id', UserController.show);

  app.get('*', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
