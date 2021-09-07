import { Rule, RuleType } from "@midwayjs/decorator";

export class AddProductDto {
    @Rule(RuleType.string().required())
    name: string;

    @Rule(RuleType.string().required())
    desc: string;
}

export class UpdateProductDto {
    @Rule(RuleType.number().required())
    id: number;

    @Rule(RuleType.string())
    name: string;

    @Rule(RuleType.string())
    desc: string;
}

export const imageField = ['image', 'detailImage1', 'detailImage2', 'detailImage3', 'detailImage4'];