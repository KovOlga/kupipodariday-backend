// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const { JWT_SECRET = 'super-strong-secret' } = process.env;
