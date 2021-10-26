import { resolve } from 'path';
import db from './models/index.mjs';

import initWorldsController from './controllers/worlds.mjs';
import initSignupController from './controllers/signup.mjs';

export default function routes(app) {
  const worldController = initWorldsController(db);
  const SignupController = initSignupController(db);

  app.get('/world/:id', worldController.show);
  app.put('/world/:id/edit', worldController.edit);
  app.post('/world', worldController.create);
  app.post('/signup', SignupController.create);
  app.get('*', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
