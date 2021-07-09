// export const okCode = 0;
// export const errCode = {
//     [okCode]: '成功',
//     10000: '参数校验异常',
//     10001: '系统用户已存在',
//     10002: '填写验证码有误',
// }

export class ResultCode {
    static AllValues = {};
    private constructor(public readonly code: number, public readonly message: string) {
        this.code = code;
        this.message = message;
        ResultCode.AllValues[code] = message;
    }

    getCode(){ return this.code }

    getMessage(){ return this.message }

    static readonly SUCCESS = new ResultCode(0, "成功");
    static readonly ARGS_ERROR = new ResultCode(10000, "参数错误");
}