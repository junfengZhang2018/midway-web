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
// import { translate } from '../../util/translate'
// import { translateDto } from '../../dto/translate';
import { BaseController } from '../base';
import { isEmpty } from 'lodash';
import { ResultCode } from '../../common/resultCode';
import { NOAUTH_PREFIX_URL } from '../base'
import { SelectProductDto } from '../../dto/product';
import { ProductController } from '../system/product';
import { SelectMsgDto } from '../../dto/msg';
import { MsgController } from '../system/msg';
import { ProductService } from '../../service/product';

@Provide()
@Controller(`${NOAUTH_PREFIX_URL}/`)
export class CommonController extends BaseController {
    @Inject()
    userService: UserService;

    @Inject()
    productService: ProductService;
    
    @Inject()
    productController: ProductController;

    @Inject()
    msgController: MsgController;

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

    // @Post('/translate')
    // @Validate()
    // async translate(@Body(ALL) body: translateDto): Promise<Results> {
    //     const { content, langs } = body;
    //     try {
    //         const result = await translate(content, {to: langs});
    //         return Results.success(result.text);
    //     } catch (err) {
    //         console.log(err);
    //         if (err.code === 400) {
    //             return Results.error(ResultCode.LANG_ERROR.getCode(), `不支持${langs}语言的翻译`);
    //         }
    //     }
    // }

    @Post('/productList')
    @Validate()
    async productList(@Body(ALL) page: SelectProductDto): Promise<Results> {
        return this.productController.getProductList(page);
    }

    @Post('/messageList')
    @Validate()
    async messageList(@Body(ALL) page: SelectMsgDto): Promise<Results> {
        return this.msgController.getMsgList(page);
    }

    @Post('/homepageList')
    @Validate()
    async homepageList(): Promise<Results> {
        const newProduct = await this.productService.getProduct({ pageNum: 1, pageSize: 5 });
        const showPageProduct = await this.productService.getProduct({ pageNum: 1, pageSize: 20, homePageShow: 1 });
        return Results.successByPage([{
            id: 0,
            title: 'Feature Product',
            list: showPageProduct
        }, {
            id: 1,
            title: 'New Product',
            list: newProduct
        }], 0, 0, 0)
    }
}
