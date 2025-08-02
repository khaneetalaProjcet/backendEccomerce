import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { InterserviceService } from 'src/interservice/interservice.service';
import {
  goldInvoice,
  goldInvoiceInterface,
} from 'src/wallet/entities/goldBoxInvoice.entity';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaProducerService } from 'src/kafka/kafka.poducer';

@Injectable()
export class CrobJobService {
  constructor(
    @InjectModel(goldInvoice.name)
    private goldInvoiceModel: Model<goldInvoiceInterface>,
    private interService: InterserviceService,
    private kafkaService: KafkaProducerService,
    // @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Interval('goldBox', 10000)
  async handleCronEveryMinute() {
    let pendings = await this.goldInvoiceModel.find({
      $and: [
        {
          status: 'pending',
        },
        { state: 1 },
      ],
    });

    // this.kafkaClient.emit('wallet', pendings);
    this.kafkaService.sendMessage('wallet', pendings);

    console.log('pendings list is>>>>>', pendings);
    // here we should req to goldBox for update the wallet
    let updatorGoldBoxResponse = await this.interService.updateGoldBox(
      pendings[0],
    );
    // and then req to order and submit the order payment

    //
  }
}
