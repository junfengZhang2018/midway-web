import { Rule, RuleType } from "@midwayjs/decorator";

export class AddProductDto {
    @Rule(RuleType.string().required())
    name: string;

    @Rule(RuleType.string().required())
    desc: string;
}