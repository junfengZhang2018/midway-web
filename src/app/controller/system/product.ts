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
import { unlinkSync } from 'fs';
import { AddProductDto, UpdateProductDto, SelectProductDto } from '../../dto/product';
import { ProductService } from '../../service/product';
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
        let { img, temp } = this.utils.dealImage(this.ctx, 'product');
        if (isEmpty((img as any).image)) {
            return Results.error(ResultCode.IMAGE_ERROR.getCode());
        }
        const result = await this.productService.addProduct({ ...product, ...img });
        this.utils.savePic(temp);
        return Results.success(result);
    }

    @Post('/list')
    @Validate()
    async getProductList(@Body(ALL) page: SelectProductDto): Promise<Results> {
        const productList = await this.productService.getProduct(page);
        const count = await this.productService.count(page);
        return Results.successByPage<Product[]>(productList, count, page.pageNum,  page.pageSize);
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
        let { img, temp } = this.utils.dealImage(this.ctx, 'product');
        const result = await this.productService.updateProduct({ ...product, ...img });
        if (result) {
            this.utils.savePic(temp);
            return Results.success(result);
        } else {
            temp.forEach(item => {
                unlinkSync(item.oldPath);
            });
            return Results.error(ResultCode.RECORD_ERROR.getCode());
        }
    }

	@Post('/detail')
    @Validate()
    async getProductDetail(@Body() id: number): Promise<Results> {
        const result = await this.productService.getProductDetail(id);
        if (result) {
            return Results.success(result);
        } else {
            return Results.error(ResultCode.RECORD_ERROR.getCode());
        }
    }
}
