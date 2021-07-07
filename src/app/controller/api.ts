import { Inject, Controller, Post, Provide } from '@midwayjs/decorator';
import { Context } from 'egg';
import { IGetUserResponse } from '../../interface';
import { UserService } from '../service/user';

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/get_user')
  async getUser(): Promise<IGetUserResponse> {
    const user = await this.userService.getUser({uid: 1});
    return { success: true, message: 'OK', data: user };
  }
}
