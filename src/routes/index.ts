import { Router } from 'express';
const app = Router();

import user from './user';
import tree from './tree';
import company from './company';

app.use('/user', user);
app.use('/tree', tree);
app.use('/company', company);

export default app;
