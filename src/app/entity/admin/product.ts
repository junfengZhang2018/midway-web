import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '../base';

@EntityModel()
export default class Product extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ comment: '名字' })
	name: string;

	@Column({ comment: '描述' })
	desc: string;

    @Column({ comment: '主图', type: 'longblob' })
	image: string;

    @Column({ comment: '副图1' })
	detailImage1: string;

    @Column({ comment: '副图2' })
	detailImage2: string;

    @Column({ comment: '副图3' })
	detailImage3: string;

    @Column({ comment: '副图4' })
	detailImage4: string;
}
