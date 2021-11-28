import {
    Inject,
    Controller,
    Provide,
    Validate,
    Post,
    Body,
    ALL,
} from '@midwayjs/decorator';
import { UserService } from '../../service/user';
import { Results } from '../../common/results';
import { loginDto } from '../../dto/user';
import { BaseController } from '../base';
import { isEmpty } from 'lodash';
import { ResultCode } from '../../common/resultCode';
import { NOAUTH_PREFIX_URL } from '../base'

@Provide()
@Controller(`${NOAUTH_PREFIX_URL}/`)
export class CommonController extends BaseController {
    @Inject()
    userService: UserService;

    @Post('/register')
    @Validate()
    async register(@Body(ALL) info: loginDto): Promise<Results> {
        const noExist = await this.userService.addUser(info);
		if (!noExist) {
			return Results.error(ResultCode.ACCOUNT_EXIST_ERROR.getCode());
		}
        return Results.success();
    }

    @Post('/login')
    @Validate()
    async login(@Body(ALL) info: loginDto): Promise<Results> {
        const sign = await this.userService.getLoginSign(info);
        if (isEmpty(sign)) {
            return Results.error(ResultCode.LOGIN_ERROR.getCode());
        }
        return Results.success(sign);
    }
}
