import { resolve } from 'path';
import db from './models/index.mjs';

export default function routes(app) {
  // insert all express api routes below

  // special JS page. Include the webpack index.html file
  // we will have the route below as the last.
  // this is because we will leave all other requests unrelated
  // to our API (we assume they are page requests) to be handled
  // by React Router
  app.get('*', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
