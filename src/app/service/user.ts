import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import SysRole from '../entity/admin/role';

@Provide()
export class UserService {
  @InjectEntityModel(SysRole)
  role: Repository<SysRole>;

  async getUser(options) {
    const result = await this.role.findOne(options)
    return result;
    // return {
    //   uid: options.uid,
    //   username: 'mockedName',
    //   phone: '12345678901232323',
    //   email: 'xxx.xxx@xxx.com',
    // };

  }
}
