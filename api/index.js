import app from '../server/dist/server/src/app.js';

export default function handler(req, res) {
  return app(req, res);
}
