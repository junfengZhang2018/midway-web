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
import { copyFileSync, unlink } from 'fs';
import { join } from 'path';
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
            try {
                let sqlPath = `/public/${this.utils.dealName(file.filename)}`;
                let copyPath = join(__dirname, `../..${sqlPath}`);
                copyFileSync(file.filepath, copyPath);
                img[file.field] = sqlPath;
            } finally {
                // 需要删除临时文件
                unlink(file.filepath, null);
            }
        }
        await this.productService.addProduct({...product, ...img});
        return true;
    }
}
