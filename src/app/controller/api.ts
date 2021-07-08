import { Inject, Controller, Post, Provide, Query } from '@midwayjs/decorator';
// import { IMidwayWebApplication } from '@midwayjs/web';
import { Context } from 'egg';
import { UserService } from '../service/user';
import { Results } from '../common/results';

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/get_user')
  async getUser(@Query() id): Promise<any> {
    return Results.error(10000)
    // const user = await this.userService.getUser(id);
    // return { success: true, message: 'OK', data: user };
  }
}
