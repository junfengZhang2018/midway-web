import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

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
  };
  config.jwtSecret = 'INnyQ50BEE6AITQraIaDGooJ';
  config.tokenTime = '24h';
  // config.security = {
  //   csrf: false,
  // };
  config.multipart = {
    mode: 'file'
  };

  return config;
};
