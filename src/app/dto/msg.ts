import { Rule, RuleType } from "@midwayjs/decorator";

export class AddMsgDto {
    @Rule(RuleType.string().required())
    title: string;

    @Rule(RuleType.string().required())
    content: string;
}

export class DelMsgDto {
    @Rule(RuleType.number().required())
    id: number;
}

@Rule(AddMsgDto)
export class UpdateMsgDto extends AddMsgDto {
    @Rule(RuleType.number().required())
    id: number;
}