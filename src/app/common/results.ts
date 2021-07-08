import { Provide, Scope, ScopeEnum } from "@midwayjs/decorator";
import { ResultCode } from "./constants"

@Provide()
@Scope(ScopeEnum.Singleton)
export class Results {
    code: number;
    message: string;
    data: any;

    constructor({code = ResultCode.SUCCESS.getCode(), message = ResultCode.SUCCESS.getMessage() || '未知错误', data = {}}){
        this.code = code;
        this.message = message;  
        this.data = data;
    }
    
    static success(data, message?: string){
        return new Results({data, message});
    }

    static successByPage<T>(list: T, total: number, pageNum: number, pageSize: number, message?: string){
        return new Results({
            data: {
                list,
                pageNum,
                pageSize,
                total
            }, message
        });
    }

    static error(code: number){
        return new Results({code, message: ResultCode.AllValues[code]});
    }
}