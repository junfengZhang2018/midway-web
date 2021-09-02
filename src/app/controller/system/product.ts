import {
    Controller,
    Provide,
    Post,
    Body,
    ALL,
    Validate,
    Inject,
} from '@midwayjs/decorator';
import { BaseController } from '../base';
import { readFileSync, unlink } from 'fs';
import { AddProductDto } from '../../dto/product';
import { ProductService } from '../../service/product';

@Provide()
@Controller('/product')
export class ProductController extends BaseController {
    @Inject()
    productService: ProductService;
    
    @Post('/upload')
    @Validate()
    async uploadFile(@Body(ALL) product: AddProductDto) {
        let img = {};
        for (const file of this.ctx.request.files) {
            // let buffer: Buffer;
            try {
              // 处理文件，比如上传到云端
              img[file.field] = readFileSync(file.filepath);
            } finally {
              // 需要删除临时文件
              unlink(file.filepath, () => { console.log('删除成功') });
            }
        }
        await this.productService.addProduct({...product, ...img});
      
        return true;
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
