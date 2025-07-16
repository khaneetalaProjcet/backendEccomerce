import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';



@Injectable()
export class CrobJobService {

    @Interval('goldBox', 10000)
    handleCronEveryMinute() {
        console.log('test pass')
    }


}
