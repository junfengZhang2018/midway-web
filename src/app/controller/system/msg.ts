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
import { AddMsgDto, DelMsgDto, UpdateMsgDto } from '../../dto/msg';
import Msg from '../../entity/admin/msg';
import { PageSearchDto } from '../../dto/page';
import { BaseController } from '../base';
// import { ResultCode } from '../../common/resultCode';

@Provide()
@Controller('/msg')
export class MsgController extends BaseController {
    @Inject()
    msgService: MsgService;

    @Post('/list')
    @Validate()
    async getMsgList(@Body(ALL) page: PageSearchDto): Promise<any> {
        const msgList = await this.msgService.getMsg(page);
        return Results.successByPage<Msg[]>(msgList[0], msgList[1], page.pageNum,  page.pageSize);
    }

    @Post('/add')
    @Validate()
    async addMsg(@Body(ALL) msg: AddMsgDto): Promise<any> {
        const result = await this.msgService.addMsg(msg);
        return Results.success(result);
    }

    @Post('/delete')
    @Validate()
    async delMsg(@Body(ALL) param: DelMsgDto): Promise<any> {
        const result = await this.msgService.delMsg(param.id);
        return Results.success(result);
    }

    @Post('/update')
    @Validate()
    async updateMsg(@Body(ALL) param: UpdateMsgDto): Promise<any> {
        const result = await this.msgService.updateMsg(param);
        return Results.success(result);
    }
}
