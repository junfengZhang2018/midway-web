import {
    Controller,
    Provide,
    Post,
    Body,
    ALL,
    Validate,
    Inject,
    Config,
} from '@midwayjs/decorator';
import { BaseController } from '../base';
import { copyFileSync, unlinkSync } from 'fs';
import { AddProductDto, UpdateProductDto, imageField } from '../../dto/product';
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

    @Config('assets')
	assets: string;
    
    @Post('/add')
    @Validate()
    async uploadFile(@Body(ALL) product: AddProductDto): Promise<Results> {
        let { img, temp } = this.dealImage();
        if (isEmpty((img as any).image)) {
            return Results.error(ResultCode.IMAGE_ERROR.getCode());
        }
        const result = await this.productService.addProduct({ ...product, ...img });
        temp.forEach(item => {
            let copyPath = this.assets + item.newPath;
            copyFileSync(item.oldPath, copyPath);
            unlinkSync(item.oldPath);
        });
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
        let { img, temp } = this.dealImage();
        const result = await this.productService.updateProduct({ ...product, ...img });
        if (result) {
            temp.forEach(item => {
                let copyPath = this.assets + item.newPath;
                copyFileSync(item.oldPath, copyPath);
                unlinkSync(item.oldPath);
            });
            return Results.success(result);
        } else {
            temp.forEach(item => {
                unlinkSync(item.oldPath);
            });
            return Results.error(ResultCode.RECORD_ERROR.getCode());
        }
    }

    dealImage() {
        let img = {},
            temp = [];
		const extName: string[] = ['image/jpeg', 'image/png'];
        if (this.ctx.request.files) {
            for (const file of this.ctx.request.files) {
                if (extName.includes(file.mime) && imageField.includes(file.field)) {
                    let sqlPath = `/product/${this.utils.dealName(file.filename)}`;
                    img[file.field] = sqlPath;
                    // 需要删除临时文件
                    temp.push({
                        oldPath: file.filepath,
                        newPath: sqlPath
                    });
                }
            }
        }
        return { img, temp };
    }
}
