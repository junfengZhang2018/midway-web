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
import { msgDto } from '../../dto/msg';
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
        return Results.success(msgList);
    }

    @Post('/add')
    @Validate()
    async addMsg(@Body(ALL) msg: msgDto): Promise<any> {
        const result = await this.msgService.addMsg(msg);
        return Results.success(result);
    }
}
