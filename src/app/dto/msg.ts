import { Rule, RuleType } from "@midwayjs/decorator";

export class AddMsgDto {
    @Rule(RuleType.string().required())
    title: string;

    @Rule(RuleType.string().required())
    content: string;
}

export class UpdateMsgDto {
    @Rule(RuleType.number().required())
    id: number;

    @Rule(RuleType.string())
    title: string;

    @Rule(RuleType.string())
    content: string;
}