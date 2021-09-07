import {
    Controller,
    Provide,
    Post,
    // Body,
    // ALL,
    Validate,
    Inject,
    Files,
} from '@midwayjs/decorator';
import { BaseController } from '../base';
// import { copyFileSync, unlink } from 'fs';
import { createWriteStream } from 'fs';
import { join } from 'path';
// import { AddProductDto } from '../../dto/product';
import { ProductService } from '../../service/product';
// import { FileStream } from '../../../../typings/app';
const sendToWormhole = require('stream-wormhole');

@Provide()
@Controller('/product1')
export class Product1Controller extends BaseController {
    @Inject()
    productService: ProductService;
	
    // 文件流模式
    @Post('/upload')
    @Validate()
    async uploadFile(@Files() parts: Function) {
        // @Body(ALL) product: AddProductDto, 
        // console.log(image)
        // const parts = this.ctx.multipart();
        let part;
        
        while ((part = await parts()) != null) {
            if (part.length) {
              	// 这是 busboy 的字段
              	console.log('field: ' + part[0]);
              	console.log('value: ' + part[1]);
              	console.log('valueTruncated: ' + part[2]);
              	console.log('fieldnameTruncated: ' + part[3]);
            } else {
              	if (!part.filename) {
              	  	// 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
              	  	// 需要做出处理，例如给出错误提示消息
              	  	return;
              	}
              	// part 是上传的文件流
              	console.log('field: ' + part.fieldname);
              	console.log('filename: ' + part.filename);
              	console.log('encoding: ' + part.encoding);
              	console.log('mime: ' + part.mime);
              	console.log('part', part)
              	let sqlPath = `/public/${part.filename}`;
              	let copyPath = join(__dirname, `../..${sqlPath}`);
              	part.pipe(createWriteStream(copyPath))
              
        	}
        	await sendToWormhole(part);
        }
        return true;
    }
}
