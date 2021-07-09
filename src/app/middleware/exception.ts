import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, MidwayWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { Results } from '../common/results';
import { ValidationError } from 'joi';
import { ResultCode } from '../common/constants';

@Provide()
export class ExecptionMiddleware implements IWebMiddleware {
    resolve(): MidwayWebMiddleware {
        return async (ctx: Context, next: IMidwayWebNext) => {
            try {
                await next();
            } catch (err) {
                ctx.logger.error(`[Exception] ${err}`);
                ctx.set('Content-Type', 'application/json');
                // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
                if (err instanceof ValidationError) {
                    ctx.body = Results.error(ResultCode.ARGS_ERROR.getCode());
                    return;
                }
                let status: number = err.status || 500;
                const message =
                  status === 500 && ctx.app.config.env === 'prod'
                    ? '服务器好像出了点问题...稍后再试试'
                    : err.message;
                ctx.status = status;
                ctx.body = message;
            }
        };
    }
}
