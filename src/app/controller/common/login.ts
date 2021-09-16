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
import { translateDto } from '../../dto/translate';
import { BaseController } from '../base';
import { isEmpty } from 'lodash';
import { ResultCode } from '../../common/resultCode';
import { translate } from '../../util/translate'
import { NOAUTH_PREFIX_URL } from '../base'
import { SelectProductDto } from '../../dto/product';
import { ProductController } from '../system/product';

@Provide()
@Controller(`${NOAUTH_PREFIX_URL}/`)
export class CommonController extends BaseController {
    @Inject()
    userService: UserService;
    
    @Inject()
    productController: ProductController;

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

    @Post('/translate')
    @Validate()
    async translate(@Body(ALL) body: translateDto): Promise<Results> {
        const { content, langs } = body;
        try {
            const result = await translate(content, {to: langs});
            return Results.success(result.text);
        } catch (err) {
            console.log(err);
            if (err.code === 400) {
                return Results.error(ResultCode.LANG_ERROR.getCode(), `不支持${langs}语言的翻译`);
            }
        }
    }

    @Post('/productList')
    @Validate()
    async productList(@Body(ALL) page: SelectProductDto): Promise<Results> {
        return this.productController.getProductList(page);
    }
}
