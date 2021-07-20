import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '../base';

enum AdminEnum { NO, YES }
enum StatusEnum { NORMAL = 1, DELETE = -1 }

@EntityModel()
export default class Users extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, comment: '姓名' })
	name: string;

	@Column({ comment: '密码' })
	password: string;

	@Column({ nullable: true, comment: '手机号' })
	phone: string;

	@Column({ nullable: true, comment: '户籍' })
	household: string;

	@Column({ nullable: true, comment: '住址' })
	address: string;

	@Column({ nullable: true, comment: '部门' })
	department: string;

	@Column({ comment: '是否管理员', default: AdminEnum.NO })
	administrators: AdminEnum;

	@Column({ comment: '是否超级管理员', default: AdminEnum.NO })
	superAdministrators: AdminEnum;

	@Column({ nullable: true, comment: '自我简介，兴趣爱好描述' })
	describe: string;

	@Column({ comment: '状态', default: StatusEnum.NORMAL })
	status: number;
}
