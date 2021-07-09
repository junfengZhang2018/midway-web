import { Rule, RuleType } from "@midwayjs/decorator";

export class hahaDto {
    @Rule(RuleType.number().min(0).max(5))
    a: number;

    @Rule(RuleType.string().required())
    b: string
}