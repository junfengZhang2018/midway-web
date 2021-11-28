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
import { unlinkSync } from 'fs';
import { AddProductDto, UpdateProductDto, imageField, SelectProductDto } from '../../dto/product';
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

    @Config('assets')
	assets: string;

    @Config('host')
	host: string;
    
    @Post('/add')
    @Validate()
    async uploadFile(@Body(ALL) product: AddProductDto): Promise<Results> {
        let { img, temp } = this.dealImage();
        if (isEmpty((img as any).image)) {
            return Results.error(ResultCode.IMAGE_ERROR.getCode());
        }
        const result = await this.productService.addProduct({ ...product, ...img });
        this.utils.savePic(temp);
        return Results.success(result);
    }

    @Post('/upload-img')
    @Validate()
    async uploadImg() {
        let { img, temp } = this.dealImage();
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
        let { img, temp } = this.dealImage();
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
