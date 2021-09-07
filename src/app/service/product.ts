import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { Utils } from '../common/utils';
import { PageSearchDto } from '../dto/page';
import { imageField } from '../dto/product';
import Product from '../entity/admin/product';
import { unlinkSync } from 'fs';
@Provide()
export class ProductService {
    @InjectEntityModel(Product)
    product: Repository<Product>;

	@Inject()
	utils: Utils;

    @Config('assets')
	assets: string;

    async getProduct(page: PageSearchDto) {
        const { pageNum, pageSize } = page;
        const result = await this.product.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize
        })
        return result;
    }

	async addProduct(option): Promise<boolean> {
		const { name, desc, image, detailImage1, detailImage2, detailImage3, detailImage4 } = option;
		await this.product.save({ name, desc, image, detailImage1, detailImage2, detailImage3, detailImage4 });
		return true;
	}

	async delProduct(id: number): Promise<boolean> {
		const product = await this.product.findOne(id);
		if (isEmpty(product)) {
			return false;
		}
		imageField.forEach(item => {
			if (product[item]) {
				let copyPath = this.assets + product[item];
				unlinkSync(copyPath);
			}
		})
		await this.product.delete(id);
		return true;
	}

	async updateProduct(option): Promise<boolean> {
		const product = await this.product.findOne(option.id);
        if (isEmpty(product)) {
			return false;
		}
		imageField.forEach(item => {
			if (option.hasOwnProperty(item) && product[item] !== option[item]) {
                if (product[item]) {
                    let copyPath = this.assets + product[item];
				    unlinkSync(copyPath);
                }
			}
		})
		await this.product.update(option.id, option);
		return true;
	}
}
