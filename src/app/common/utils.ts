import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as JsonWebToken from 'jsonwebtoken';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Utils {
    @Config('jwtSecret')
    jwtSecret: number;
    /**
     * JsonWebToken Sign
     * https://github.com/auth0/node-jsonwebtoken
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    jwtSign(sign: any, options?: any): string {
        return JsonWebToken.sign(sign, this.jwtSecret, options);
    }

    /**
     * JsonWebToken Verify
     * https://github.com/auth0/node-jsonwebtoken
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    jwtVerify(token: string, options?: any): any {
        return JsonWebToken.verify(token, this.jwtSecret, options);
    }

    dealName(fileName: string): string {
        let fileArr = fileName.split('.');
        fileArr[fileArr.length-2] = fileArr[fileArr.length-2] + '_' + Date.now();
        return fileArr.join('.');
    }
}