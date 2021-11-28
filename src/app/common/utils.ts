import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as JsonWebToken from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import { copyFileSync, unlinkSync } from 'fs';

type picObj = {
    newPath: string,
    oldPath: string
}
@Provide()
@Scope(ScopeEnum.Singleton)
export class Utils {
    @Config('jwtSecret')
    jwtSecret: number;

    @Config('assets')
    assets: string;
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

    savePic(pic: Array<picObj>) {
        pic.forEach(item => {
            let copyPath = this.assets + item.newPath;
            copyFileSync(item.oldPath, copyPath);
            unlinkSync(item.oldPath);
        });
    }
}