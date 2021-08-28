import { Rule, RuleType } from "@midwayjs/decorator";

export class msgDto {
    @Rule(RuleType.string().required())
    title: string;

    @Rule(RuleType.string().required())
    content: string
}