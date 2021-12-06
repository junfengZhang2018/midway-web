import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import Users from '../entity/admin/users';
import { loginDto, UpdatePasswordDto } from '../dto/user';
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
		const sign = this.utils.jwtSign({ name: user.name, uid: user.id }, { expiresIn: this.tokenTime })
        return sign;
    }

	async updatePassword(uid: number, dto: UpdatePasswordDto): Promise<boolean> {
		const user = await this.user.findOne({ id: uid });
		if (isEmpty(user)) {
		  	throw new Error('update password user is not exist');
		}
		const comparePassword = this.utils.md5(dto.originPassword);
		// 原密码不一致，不允许更改
		if (user.password !== comparePassword) {
		  	return false;
		}
		const password = this.utils.md5(dto.newPassword);
		await this.user.update({ id: uid }, { password });
		return true;
	}
}
