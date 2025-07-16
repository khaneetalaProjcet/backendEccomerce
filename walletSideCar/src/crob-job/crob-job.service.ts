import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class CrobJobService {

    @Cron('45 * * * * *')
    handleCronEveryMinute() {
        console.log('test pass')
    }


}
