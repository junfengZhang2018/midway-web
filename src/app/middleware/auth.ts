import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, MidwayWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { isEmpty } from 'lodash';
// import { ValidationError } from 'joi';
import { Results } from '../common/results';
import { ResultCode } from '../common/resultCode';
import { Utils } from '../common/utils'
import { NOAUTH_PREFIX_URL } from '../controller/base';

@Provide()
export class AuthMiddleware implements IWebMiddleware {
    resolve(): MidwayWebMiddleware {
        return async (ctx: Context, next: IMidwayWebNext) => {
            let validErr: boolean = false;
            const url = ctx.url;
            const token = ctx.get('token');
            // if (url.startsWith(ADMIN_PREFIX_URL)) {
            if (url.startsWith(NOAUTH_PREFIX_URL)) {
                await next();
                return;
            }
            if (isEmpty(token)) {
                validErr = true;
            }
            const utils = await ctx.requestContext.getAsync(Utils);
            try {
                // 挂载对象到当前请求上
                ctx.admin = utils.jwtVerify(token);
                if (!ctx.admin) {
                    validErr = true;
                }
            } catch (e) {
                // 无法通过token校验
                validErr = true;
            }
            await next();
            validErr && this.reject(ctx);
            // }
        };
    }
    
    reject(ctx: Context): void {
        ctx.status = 200;
        ctx.body = Results.error(ResultCode.TOKEN_ERROR.getCode());
    }
}
