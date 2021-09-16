import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import Users from '../entity/admin/users';
import { loginDto } from '../dto/user';
import { isEmpty } from 'lodash';
import { Utils } from '../common/utils';
@Provide()
export class UserService {
    @InjectEntityModel(Users)
    user: Repository<Users>;

	@Inject()
	utils: Utils;

	@Config('tokenTime')
	tokenTime: string;
    
	async addUser(option: loginDto): Promise<boolean> {
		const { name, password } = option;
		const exist = await this.user.findOne({ name });
		if (!isEmpty(exist)) {
			return false;
		}
		let user = new Users();
		user.name = name;
		user.password = this.utils.md5(password);
		await this.user.save(user);
		return true;
	}

    async getLoginSign(option: loginDto): Promise<string> {
		const { name, password } = option;
        const user = await this.user.findOne({ name });
		if (isEmpty(user)) {
			return null;
		}
		if (password !== user.password) {
			return null;
		}
		const sign = this.utils.jwtSign({ name: user.name }, { expiresIn: this.tokenTime })
        return sign;
    }

	async updatePassword(){
		
	}
}
