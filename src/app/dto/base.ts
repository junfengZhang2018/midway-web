import { Expose } from 'class-transformer';
import { Rule, RuleType } from '@midwayjs/decorator';

// 分页
export class PageSearchDto {
    @Rule(RuleType.number().integer().min(0).default(10))
    @Expose()
    pageNum: number;

    @Rule(RuleType.number().integer().min(1).default(1))
    @Expose()
    pageSize: number;
}
