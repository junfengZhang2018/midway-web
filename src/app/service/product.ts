import { Config, Inject, Provide, TaskLocal } from '@midwayjs/decorator'; //
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like } from 'typeorm';
import { isEmpty } from 'lodash';
import { Utils } from '../common/utils';
import { imageField, SelectProductDto } from '../dto/product';
import Product from '../entity/admin/product';
import { existsSync, readdir, stat, unlinkSync } from 'fs';
import { extname } from 'path';
@Provide()
export class ProductService {
    @InjectEntityModel(Product)
    product: Repository<Product>;

	@Inject()
	utils: Utils;

    @Config('assets')
	assets: string;

    async getProduct(page: SelectProductDto) {
        const { pageNum, pageSize, name = '', homePageShow = '' } = page;
        const result = await this.product.find({
            where: {
				name: Like(`%${name}%`),
				homePageShow: Like(`%${homePageShow}%`)
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
		await this.product.save({ ...option, star: Math.random() > 0.5 ? 4 : 5 });
		const allImg = this.utils.getSrc(option.information);
		this.utils.deleteLockFile(allImg);
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
				if (existsSync(copyPath)) {
					unlinkSync(copyPath);
				}
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
				    if (existsSync(copyPath)) {
				    	unlinkSync(copyPath);
					}
                }
                if (option[item] === 'null') {
                    option[item] = null;
                }
			}
		})
		await this.product.update(option.id, option);
		const allImg = this.utils.getSrc(option.information);
		this.utils.deleteLockFile(allImg);
		return true;
	}

	async getProductDetail(id: number) {
        const result = await this.product.findOne(id);
        return result;
    }

	@TaskLocal('0 0 0 * * *')    
  	async test(){
		const basePath = this.assets + '/editor'
		readdir(basePath, (err, files) => {
			files.forEach(filename => {
				const fileExt = extname(filename);
				let lockFile = basePath + '/' + filename.substring(0, filename.lastIndexOf("."));
				if (fileExt) {
					stat(lockFile, (err, stats) => {
						if (!err && Date.now() - stats.birthtimeMs > 24 * 60 * 60 * 1000) {
							unlinkSync(basePath + '/' + filename);
							unlinkSync(lockFile);
						}
					})
				}
			})
		})
  	}
}
