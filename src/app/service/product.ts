import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
// import { isEmpty } from 'lodash';
import { Utils } from '../common/utils';
import Product from '../entity/admin/product';
@Provide()
export class ProductService {
    @InjectEntityModel(Product)
    product: Repository<Product>;

	@Inject()
	utils: Utils;

    async getProduct(page) {
        const { pageNum, pageSize } = page;
        const result = await this.product.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize
        })
        return result;
    }

	async addProduct(option): Promise<boolean> {
        console.log(option)
		// const { name, desc, image, detailImage1, detailImage2, detailImage3, detailImage4 } = option;
		const { name, desc, image } = option;
		// const exist = await this.user.findOne({ name });
		// if (!isEmpty(exist)) {
		// 	return false;
		// }
		let product = new Product();
		product.name = name;
		product.desc = desc;
        // function toArrayBuffer(myBuf) {
        //     var myBuffer = new ArrayBuffer(myBuf.length);
        //     var res = new Uint8Array(myBuffer);
        //     for (var i = 0; i < myBuf.length; ++i) {
        //        res[i] = myBuf[i];
        //     }
        //     return myBuffer;
        // }
        product.image = JSON.stringify(image)
        
		// await this.product.save({ name, desc, image, detailImage1, detailImage2, detailImage3, detailImage4 });
		await this.product.save(product);
		return true;
	}

    // async getLoginSign(option: loginDto): Promise<string> {
	// 	const { name, password } = option;
    //     const user = await this.user.findOne({ name });
	// 	if (isEmpty(user)) {
	// 		return null;
	// 	}
	// 	if (password !== user.password) {
	// 		return null;
	// 	}
	// 	const sign = this.utils.jwtSign({ name: user.name }, { expiresIn: this.tokenTime })
    //     return sign;
    // }

	// async updatePassword(){
		
	// }
}
