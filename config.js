 'use strict';

const config = {};
config.secret = process.env.JWT_SECRET || '3bda7654bca0a6359d7465ac5f68451f';
config.algorithm = 'HS256';
config.expiresIn = {
  ACCESS_TOKEN: '1h',
  REFRESH_TOKEN: '3d'
};
config.noTimestamp = true;

config.host = process.env.MAIL_HOST || 'smtp.mailtrap.io';
config.user = process.env.MAIL_USER || '8a093f10806a80';
config.pass = process.env.MAIL_PASS || 'd82c229cc38d6b';

module.exports = config;
