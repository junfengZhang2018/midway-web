import {
    Inject,
    Controller,
    Provide,
    Validate,
    Post,
    Body,
    ALL,
} from '@midwayjs/decorator';
import { MsgService } from '../../service/msg';
import { Results } from '../../common/results';
import { AddMsgDto, UpdateMsgDto } from '../../dto/msg';
import { DelDto } from '../../dto/base';
import Msg from '../../entity/admin/msg';
import { SelectMsgDto } from '../../dto/msg';
import { BaseController } from '../base';
// import { ResultCode } from '../../common/resultCode';

@Provide()
@Controller('/msg')
export class MsgController extends BaseController {
    @Inject()
    msgService: MsgService;

    @Post('/list')
    @Validate()
    async getMsgList(@Body(ALL) page: SelectMsgDto): Promise<Results> {
        const msgList = await this.msgService.getMsg(page);
        const count = await this.msgService.count(page);
        return Results.successByPage<Msg[]>(msgList, count, page.pageNum,  page.pageSize);
    }

    @Post('/add')
    @Validate()
    async addMsg(@Body(ALL) msg: AddMsgDto): Promise<Results> {
        const result = await this.msgService.addMsg(msg);
        return Results.success(result);
    }

    @Post('/delete')
    @Validate()
    async delMsg(@Body(ALL) param: DelDto): Promise<Results> {
        const result = await this.msgService.delMsg(param.id);
        return Results.success(result);
    }

    @Post('/update')
    @Validate()
    async updateMsg(@Body(ALL) param: UpdateMsgDto): Promise<Results> {
        const result = await this.msgService.updateMsg(param);
        return Results.success(result);
    }
}
