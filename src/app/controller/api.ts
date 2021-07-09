import { Inject, Controller, Provide, Validate, Post, Body, ALL } from '@midwayjs/decorator';
// import { IMidwayWebApplication } from '@midwayjs/web';
import { Context } from 'egg';
import { UserService } from '../service/user';
import { Results } from '../common/results';
import { hahaDto } from '../dto/common'
// import { ResultCode } from '../common/constants';

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/get_user')
  @Validate()
  async getUser(@Body(ALL) id: hahaDto): Promise<any> {
    console.log(id)
    const user = await this.userService.getUser(id);
    return Results.success(user);
    // return Results.error(ResultCode.ARGS_ERROR.getCode())
    // return { success: true, message: 'OK', data: user };
  }
}
