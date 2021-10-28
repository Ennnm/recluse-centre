import { resolve } from 'path';
import db from './models/index.mjs';

import initWorldsController from './controllers/worlds.mjs';
import initSignupController from './controllers/signup.mjs';
import initLoginController from './controllers/login.mjs';

export default function routes(app) {
  console.log('test');
  const worldController = initWorldsController(db);
  const SignupController = initSignupController(db);
  const LoginController = initLoginController(db);

  app.get('/world/:id', worldController.show);
  app.put('/world/:id/edit', worldController.edit);
  app.post('/world', worldController.create);
  app.post('/signup', SignupController.create);
  app.post('/login', LoginController.create);
  app.delete('/logout', LoginController.destroy);
  app.get('*', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
