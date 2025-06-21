import { createServer, Model, Server } from 'miragejs';
import { routes } from './routes';

export function makeServer(): Server {
  return createServer({
    models: {
      user: Model,
    },
    routes,
  });
}
