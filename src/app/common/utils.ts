import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as JsonWebToken from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import { copyFileSync, unlinkSync } from 'fs';
import { imageField } from '../dto/product';

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

    dealImage(ctx) {
        let img = {},
            temp = [];
		const extName: string[] = ['image/jpeg', 'image/png'];
        if (ctx.request.files) {
            for (const file of ctx.request.files) {
                if (extName.includes(file.mime) && imageField.includes(file.field)) {
                    let sqlPath = `/product/${this.dealName(file.filename)}`;
                    img[file.field] = sqlPath;
                    // 需要删除临时文件
                    temp.push({
                        oldPath: file.filepath,
                        newPath: sqlPath
                    });
                }
            }
        }
        return { img, temp };
    }

    savePic(pic: Array<picObj>) {
        pic.forEach(item => {
            let copyPath = this.assets + item.newPath;
            copyFileSync(item.oldPath, copyPath);
            unlinkSync(item.oldPath);
        });
    }
}