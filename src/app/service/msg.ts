import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import Msg from '../entity/admin/msg';
import { msgDto } from '../dto/msg';
// import { isEmpty } from 'lodash';
import { Context } from 'egg';
import { Utils } from '../common/utils';
import { PageSearchDto } from '../dto/page';
@Provide()
export class MsgService {
    @InjectEntityModel(Msg)
    msg: Repository<Msg>;

	@Inject()
	utils: Utils;

    @Inject()
    ctx: Context;

    async getMsg(page: PageSearchDto): Promise<[Msg[], number]> {
        const { pageNum, pageSize } = page;
        const result = await this.msg.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize
        })
        return result;
    }

	async addMsg(option: msgDto): Promise<boolean> {
		const { title, content } = option;
		let msg = new Msg();
		msg.title = title;
		msg.content = content;
        msg.author = this.ctx.admin.name;
		await this.msg.save(msg);
		return true;
	}
}
