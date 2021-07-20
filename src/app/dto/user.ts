import { Rule, RuleType } from "@midwayjs/decorator";

export class loginDto {
    @Rule(RuleType.string().required())
    name: string;

    @Rule(RuleType.string().required())
    password: string
}