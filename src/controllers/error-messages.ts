export enum ErrorMessages {
  INVALID_INPUT = 'Invalid input',
  NOT_FOUND = 'Not found in DB',
  INSERTION_FAILED = 'Failed to insert new item',
  UPDATING_FAILED = 'Failed to update item',
  DELETION_FAILED = 'Failed to delete item',
  INVALID_ID = 'Id is invalid',
  FORBIDDEN = 'forbidden',
  DB_INTERNAL = 'DB data fetching error',
  SESSION_REGEN = 'Session regeneration error',
  SESION_KILL = 'Session destroy error',
  REGISTER = "Failed to register new user",
  CONFLICT = "User with this login already exists",
  DB_CONN = "Failed to connect to DB",
  SERVER_START = "Failed to start server",
  INDEX_RENDER = "Failed to render index page"
}