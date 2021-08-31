import { Expose } from 'class-transformer';
import { Rule, RuleType } from '@midwayjs/decorator';

// 分页
export class PageSearchDto {
    // 页数
    @Rule(RuleType.number().integer().min(0).default(1))
    @Expose()
    pageNum: number;

    // 一页多少条
    @Rule(RuleType.number().integer().min(1).default(10))
    @Expose()
    pageSize: number;
}
