import User, { UserType } from '../models/definitions/User';

const { check } = require('express-validator/check');

function validateUserType(typeField: string) {
  // do the check and return that same thing
  return check(typeField).isInt({ min: UserType.ADMIN, max: UserType.NORMAL_USER });
}

export { validateUserType };
