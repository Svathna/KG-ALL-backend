import { Router } from 'express';
const app = Router();

import dot from './dot';

app.use('/', dot);

export default app;
