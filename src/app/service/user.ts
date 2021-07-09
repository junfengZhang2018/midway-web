import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import SysRole from '../entity/admin/role';
import { hahaDto } from '../dto/common'
@Provide()
export class UserService {
  @InjectEntityModel(SysRole)
  role: Repository<SysRole>;

  async getUser(option: hahaDto) {
    console.log(option);
    const result = await this.role.count()
    return result;
    // return {
    //   uid: options.uid,
    //   username: 'mockedName',
    //   phone: '12345678901232323',
    //   email: 'xxx.xxx@xxx.com',
    // };

  }
}
