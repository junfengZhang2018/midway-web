import {
    Inject,
    Controller,
    Provide,
    Validate,
    Get,
    Post,
    Body,
    ALL,
} from '@midwayjs/decorator';
// import { IMidwayWebApplication } from '@midwayjs/web';
import { UserService } from '../../service/user';
import { Results } from '../../common/results';
import { loginDto } from '../../dto/user';
import { BaseController } from '../base';
import { isEmpty } from 'lodash';
import { ResultCode } from '../../common/resultCode';
import * as translate from 'google-translate-api'
// const translate = require('google-translate-api')

@Provide()
@Controller('/')
export class CommonController extends BaseController {
    @Inject()
    userService: UserService;

    @Post('/register')
    @Validate()
    async register(@Body(ALL) info: loginDto): Promise<any> {
        const noExist = await this.userService.addUser(info);
		if (!noExist) {
			return Results.error(ResultCode.ACCOUNT_EXIST_ERROR.getCode());
		}
        return Results.success();
    }

    @Post('/login')
    @Validate()
    async login(@Body(ALL) info: loginDto): Promise<any> {
        const sign = await this.userService.getLoginSign(info);
        if (isEmpty(sign)) {
            return Results.error(ResultCode.LOGIN_ERROR.getCode());
        }
        return Results.success(sign);
    }

    @Get('/translate')
    @Validate()
    async haha(): Promise<any> {
        console.log(translate.a)
        try {
            const a = await translate.a("['你好','看看','猪头']", {to: 'fr'})
            return Results.success(a);
        }catch(err){
            console.log(err)
        }
        
        // const sign = await this.userService.getLoginSign(info);
        // if (isEmpty(sign)) {
        //     return Results.error(ResultCode.LOGIN_ERROR.getCode());
        // }
        
    }
}
