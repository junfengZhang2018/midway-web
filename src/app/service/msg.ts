import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Like, Repository } from 'typeorm';
import Msg from '../entity/admin/msg';
import { AddMsgDto, SelectMsgDto, UpdateMsgDto } from '../dto/msg';
// import { isEmpty } from 'lodash';
import { Context } from 'egg';
import { Utils } from '../common/utils';
@Provide()
export class MsgService {
    @InjectEntityModel(Msg)
    msg: Repository<Msg>;

	@Inject()
	utils: Utils;

    @Inject()
    ctx: Context;

    async getMsg(page: SelectMsgDto): Promise<Msg[]> {
        const { pageNum, pageSize, title = '' } = page;
        const result = await this.msg.find({
			where: {
				title: Like(`%${title}%`)
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
		const { title = '' } = page;
		const result = await this.msg.count({
			where: {
				title: Like(`%${title}%`)
			}
		});
        return result;
	}

	async addMsg(option: AddMsgDto): Promise<boolean> {
		const { title, content } = option;
		let msg = new Msg();
		msg.title = title;
		msg.content = content;
        msg.author = this.ctx.admin.name;
		await this.msg.save(msg);
		return true;
	}

    async delMsg(id: number): Promise<boolean> {
		await this.msg.delete(id);
		return true;
	}

    async updateMsg(option: UpdateMsgDto): Promise<boolean> {
		await this.msg.update(option.id, {author: this.ctx.admin.name, ...option});
		return true;
	}
}
