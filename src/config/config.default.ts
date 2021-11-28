import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { ConnectionOptions } from 'typeorm';
import { join } from 'path';
import { networkInterfaces } from 'os'

function getIPAdress() {
  var interfaces = networkInterfaces();
  for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }
  }
}

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1625490462284_4860';

  // add your config here
  config.middleware = [
    'execptionMiddleware',
    'authMiddleware',
    'notfoundHandler',
  ];

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };
  config.orm = {
    type: 'mysql',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'trade',
    synchronize: true,
    logging: false,
  } as ConnectionOptions;
  config.jwtSecret = 'INnyQ50BEE6AITQraIaDGooJ';
  config.tokenTime = '24h';
  // config.security = {
  //   csrf: false,
  // };
  config.multipart = {
    mode: 'file'
  };

  config.assets = join(__dirname, '../app/public');
  config.host = 'http://' + getIPAdress() + ':7001';
  config.cors = {
    origin: '*'
  }

  return config;
};
