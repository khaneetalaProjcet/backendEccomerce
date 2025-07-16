import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class CrobJobService {

    @Cron(CronExpression.EVERY_5_SECONDS) // Runs every minute
    handleCronEveryMinute() {
        console.log('test pass')
    }


}
