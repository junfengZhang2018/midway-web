import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as JsonWebToken from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

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

    md5(msg: string): string {
        return CryptoJS.MD5(msg).toString();
      }

    dealName(fileName: string): string {
        let fileArr = fileName.split('.');
        fileArr[fileArr.length-2] = fileArr[fileArr.length-2] + '_' + Date.now();
        return fileArr.join('.');
    }
}