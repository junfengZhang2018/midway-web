import { Provide } from '@midwayjs/decorator';

@Provide()
export class UserService {
  async getUser(options) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901232323',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
