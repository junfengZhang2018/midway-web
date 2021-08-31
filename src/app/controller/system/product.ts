import {
    Controller,
    Provide,
    Post,
} from '@midwayjs/decorator';
import { BaseController } from '../base';

@Provide()
@Controller('/product')
export class ProductController extends BaseController {
    @Post('/upload')
    async uploadFile() {
        // const file = this.ctx.request.files[0];
        // const name = 'egg-multipart-test/' + basename(file.filename);
        // let result;
        // try {
        //     // 处理文件，比如上传到云端
        //     result = await this.ctx.oss.put(name, file.filepath);
        // } finally {
        //     // 需要删除临时文件
        //     await fs.unlink(file.filepath);
        // }

        // return {
        //     url: result.url,
        //     // 获取所有的字段值
        //     requestBody: ctx.request.body,
        // };
    }
}
