import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import * as JsonWebToken from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import { closeSync, copyFileSync, existsSync, openSync, unlinkSync } from 'fs';
import { imageField } from '../dto/product';
import { Context } from 'egg';

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

    dealImage(ctx: Context, module: string) {
        let img = {},
            temp = [];
        if (module && !module.startsWith('/')) {
            module = '/' + module;
        }
		const extName: string[] = ['image/jpeg', 'image/png'];
        if (ctx.request.files) {
            for (const file of ctx.request.files) {
                if (extName.includes(file.mime) && imageField.includes(file.field)) {
                    let filename = this.dealName(file.filename);
                    let sqlPath = `${module}/${filename}`;
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

    createLockFile(name: string[]) {
        name.forEach(item => {
            closeSync(openSync(this.assets + item, 'w'))
        });
    }

    deleteLockFile(allImg: string[]) {
        allImg.forEach(item => {
			let [ , filename ] = item.split('/public');
			filename = this.assets + filename.substring(0, filename.lastIndexOf("."));
			if (existsSync(filename)) {
				unlinkSync(filename);
			}
		})
    }

    getSrc(html: string): string[] {
        var imgReg = /<img.*?(?:>|\/>)/gi;
        // 匹配src属性
        var srcReg = /src=[\\"]?([^\\"]*)[\\"]?/i;
        var arr = html.match(imgReg);
        let imgs = [],
            arrEntities = {'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                var src = arr[i].match(srcReg)[1];
                src = src.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all,t) => arrEntities[t] );
                imgs.push(src);
            }
        }
        return imgs;
    }
}