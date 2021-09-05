import { Rule, RuleType } from "@midwayjs/decorator";

export class DelDto {
    @Rule(RuleType.number().required())
    id: number;
}