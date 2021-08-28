import { Rule, RuleType } from "@midwayjs/decorator";

export class translateDto {
    @Rule(RuleType.string().required())
    content: string;

    @Rule(RuleType.string().default('en'))
    langs: string;
}