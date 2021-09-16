import { Rule, RuleType } from "@midwayjs/decorator";
import { PageSearchDto } from "./page";

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

    @Rule(RuleType.equal('null'))
    detailImage1?: string;

    @Rule(RuleType.equal('null'))
    detailImage2?: string;

    @Rule(RuleType.equal('null'))
    detailImage3?: string;

    @Rule(RuleType.equal('null'))
    detailImage4?: string;
}

@Rule(PageSearchDto)
export class SelectProductDto extends PageSearchDto {
    @Rule(RuleType.string().empty(''))
    name: string;
}

export const imageField = ['image', 'detailImage1', 'detailImage2', 'detailImage3', 'detailImage4'];