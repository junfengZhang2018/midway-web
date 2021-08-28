import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import Msg from '../entity/admin/msg';
import { msgDto } from '../dto/msg';
// import { isEmpty } from 'lodash';
import { Utils } from '../common/utils';
import { PageSearchDto } from '../dto/page';
@Provide()
export class MsgService {
    @InjectEntityModel(Msg)
    msg: Repository<Msg>;

	@Inject()
	utils: Utils;

    async getMsg(page: PageSearchDto): Promise<Msg[]> {
        const { pageNum, pageSize } = page;
        const result = await this.msg.find({
            take: pageSize,
            skip: pageNum * pageSize
        })
        return result;
    }

	async addMsg(option: msgDto): Promise<boolean> {
		const { title, content } = option;
		let msg = new Msg();
		msg.title = title;
		msg.content = content;
		await this.msg.save(msg);
		return true;
	}
}
