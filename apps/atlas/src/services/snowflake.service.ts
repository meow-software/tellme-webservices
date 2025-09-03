import { Injectable } from '@nestjs/common';
import { SnowflakeGenerator } from 'src/lib';

@Injectable()
export class SnowflakeService extends SnowflakeGenerator {
    private generator: SnowflakeGenerator;

    constructor() {
        super(Number(process.env.SNOWFLAKE_WORKER_ID ?? 1));
        this.generator = new SnowflakeGenerator(1);
    }
}