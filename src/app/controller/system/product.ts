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
import { copyFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { AddProductDto, UpdateProductDto, imageField, ImageSet } from '../../dto/product';
import { ProductService } from '../../service/product';
import { PageSearchDto } from '../../dto/page';
import { Results } from '../../common/results';
import Product from '../../entity/admin/product';
import { DelDto } from '../../dto/base';
import { ResultCode } from '../../common/resultCode';
import { isEmpty } from 'lodash';

@Provide()
@Controller('/product')
export class ProductController extends BaseController {
    @Inject()
    productService: ProductService;
    
    @Post('/add')
    @Validate()
    async uploadFile(@Body(ALL) product: AddProductDto): Promise<Results> {
        let img = this.dealImage();
        if (isEmpty(img.image)) {
            return Results.error(ResultCode.IMAGE_ERROR.getCode());
        }
        const result = await this.productService.addProduct({ ...product, ...img });
        return Results.success(result);
    }

    @Post('/list')
    @Validate()
    async getProductList(@Body(ALL) page: PageSearchDto): Promise<Results> {
        const productList = await this.productService.getProduct(page);
        return Results.successByPage<Product[]>(productList[0], productList[1], page.pageNum,  page.pageSize);
    }

	@Post('/delete')
    @Validate()
	async delProduct(@Body(ALL) param: DelDto): Promise<Results> {
        const result = await this.productService.delProduct(param.id);
        if (result) {
            return Results.success(result);
        } else {
            return Results.error(ResultCode.RECORD_ERROR.getCode());
        }
    }

	@Post('/update')
    @Validate()
    async updateProduct(@Body(ALL) product: UpdateProductDto): Promise<Results> {
        let img = this.dealImage();
        if (img.hasOwnProperty('image') && isEmpty(img.image)) {
            delete img.image;
        }
        const result = await this.productService.updateProduct({ ...product, ...img });
        if (result) {
            return Results.success(result);
        } else {
            return Results.error(ResultCode.RECORD_ERROR.getCode());
        }
    }

    dealImage(): ImageSet {
        let img = {};
		const extName: string[] = ['image/jpeg', 'image/png'];
        for (const file of this.ctx.request.files) {
			if (extName.includes(file.mime) && imageField.includes(file.field)) {
				let sqlPath = `/public/${this.utils.dealName(file.filename)}`;
				let copyPath = join(__dirname, `../..${sqlPath}`);
				copyFileSync(file.filepath, copyPath);
				img[file.field] = sqlPath;
				// 需要删除临时文件
				unlinkSync(file.filepath);
			}
        }
        return img as ImageSet;
    }
}
