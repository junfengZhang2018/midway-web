import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as orm from '@midwayjs/orm';
@Configuration({
    imports: [
        orm, // 加载 orm 组件
    ],
    importConfigs: [join(__dirname, './config')],
    conflictCheck: true, // 启用类名冲突检查
})
export class ContainerLifeCycle implements ILifeCycle {
    @App()
    app: Application;

    async onReady() {}
}
