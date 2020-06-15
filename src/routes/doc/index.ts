import { Router } from 'express';
const app = Router();

import doc from './doc';

app.use('/', doc);

export default app;
