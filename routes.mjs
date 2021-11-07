import { resolve } from 'path';
import db from './models/index.mjs';

import initWorldsController from './controllers/worlds.mjs';
import initMessageController from './controllers/messages.mjs';
import initSignupController from './controllers/signup.mjs';
import initLoginController from './controllers/login.mjs';
import initUsersController from './controllers/users.mjs';

export default function routes(app) {
  console.log('test');
  const worldController = initWorldsController(db);
  const MessageController = initMessageController(db);
  const SignupController = initSignupController(db);
  const LoginController = initLoginController(db);
  const UserController = initUsersController(db);

  // WORLD CONTROL
  app.get('/world/:id', worldController.show);
  app.put('/world/:id/edit', worldController.edit);
  app.post('/world', worldController.create);
  app.post('/world/:id/createmessage', MessageController.create);
  app.get('/world/:id/showmessages', MessageController.show);

  // USER CONTROL
  app.post('/signup', SignupController.create);
  app.post('/login', LoginController.create);
  app.delete('/logout', LoginController.destroy);
  app.get('/user/:id', UserController.show);
  app.put('/user/:id/update', UserController.update);

  app.get('*', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
