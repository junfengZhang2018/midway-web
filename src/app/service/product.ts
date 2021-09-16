import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like } from 'typeorm';
import { isEmpty } from 'lodash';
import { Utils } from '../common/utils';
import { imageField, SelectProductDto } from '../dto/product';
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

    async getProduct(page: SelectProductDto) {
        const { pageNum, pageSize, name = '' } = page;
        const result = await this.product.find({
            where: {
				name: Like(`%${name}%`)
			},
			order: {
				updateTime: 'DESC'
			},
            take: pageSize,
            skip: (pageNum - 1) * pageSize
        })
        return result;
    }

    async count(page): Promise<number> {
		const { name = '' } = page;
		const result = await this.product.count({
			where: {
				name: Like(`%${name}%`)
			}
		});
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
                if (option[item] === 'null') {
                    option[item] = null;
                }
			}
		})
		await this.product.update(option.id, option);
		return true;
	}
}
