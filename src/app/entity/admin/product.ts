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

    @Column({ comment: '主图' })
	image: string;

    @Column({ comment: '原价格' })
	oldPrice: string;

    @Column({ comment: '折扣价格' })
	price: string;

    @Column({ comment: '星级' })
	star: number;

    @Column({ comment: '是否在首页展示' })
	homePageShow: number;

	@Column({ comment: '信息', type: 'longtext' })
	information: string;

    @Column({ comment: '副图1', nullable: true })
	detailImage1: string;

    @Column({ comment: '副图2', nullable: true })
	detailImage2: string;

    @Column({ comment: '副图3', nullable: true })
	detailImage3: string;

    @Column({ comment: '副图4', nullable: true })
	detailImage4: string;
}
