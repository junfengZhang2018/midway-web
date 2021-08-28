import { Provide } from '@midwayjs/decorator';
import { Context } from 'egg';
import { IWebMiddleware, MidwayWebMiddleware, IMidwayWebNext } from '@midwayjs/web';

class NotFoundError extends Error {
	public status: number;
	constructor() {
		super();
		this.status = 404;
		this.message = '路径不存在';
	}
}

@Provide('notfoundHandler')
export class NotFoundHandlerMiddleware implements IWebMiddleware {
	resolve(): MidwayWebMiddleware {
    	return async (ctx: Context, next: IMidwayWebNext) => {
      		await next();
      		if (ctx.status === 404 && !ctx.body) {
				throw new NotFoundError();
			}
    	};
  	}
}