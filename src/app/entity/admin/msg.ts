import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '../base';

@EntityModel()
export default class Msg extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ comment: '标题', length: 30 })
	title: string;

	@Column({ comment: '内容' })
	content: string;

    @Column({ comment: '作者' })
	author: string;
}
