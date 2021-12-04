import {
    Inject,
    Controller,
    Provide,
    Validate,
    Post,
    Body,
    Config,
} from '@midwayjs/decorator';
import { UserService } from '../../service/user';
import { Results } from '../../common/results';
import { existsSync, unlinkSync } from 'fs';
import { BaseController } from '../base';
import { NOPERM_PREFIX_URL } from '../base'

@Provide()
@Controller(`${NOPERM_PREFIX_URL}/`)
export class CommonController extends BaseController {
    @Inject()
    userService: UserService;
    
    @Config('assets')
	assets: string;

    @Config('host')
	host: string;

    @Post('/upload-img')
    @Validate()
    async uploadImg() {
        let { img, temp } = this.utils.dealImage(this.ctx);
        this.utils.savePic(temp);
        return {
            // errno 即错误代码，0 表示没有错误。
            //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
            "errno": 0,
            // data 是一个数组，返回图片Object，Object中包含需要包含url、alt和href三个属性,它们分别代表图片地址、图片文字说明和跳转链接,alt和href属性是可选的，可以不设置或设置为空字符串,需要注意的是url是一定要填的。
            "data": [
                {
                    url: `${this.host}/public${(img as any).image}`,
                    // alt: "图片文字说明",
                    // href: "跳转链接"
                }
            ]
        };
    }

    @Post('/delete-img')
    @Validate()
    async deleteImg(@Body() fileArr: string[]) {
        fileArr.forEach(filename => {
            const file = this.assets + filename;
            if (existsSync(file)) {
                unlinkSync(file);
            }
        })
        return Results.success();
    }

    @Post('/password/update')
    @Validate()
    async updatePassword(@Body() fileArr: string[]) {
        fileArr.forEach(filename => {
            const file = this.assets + filename;
            if (existsSync(file)) {
                unlinkSync(file);
            }
        })
        return Results.success();
    }
}
