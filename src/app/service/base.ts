import { getConnection, getManager, Connection, EntityManager } from 'typeorm';

export class BaseService {
  getConnection(): Connection {
    return getConnection('default');
  }

  getManager(): EntityManager {
    return getManager('default');
  }
}