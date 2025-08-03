// import { Controller } from '@nestjs/common';
// import { EventPattern, Payload } from '@nestjs/microservices';

// @Controller()
// export class OrderKafkaConsumer {
//   @EventPattern('wallet')
//   async handleWalletMessage(@Payload() message: any) {
//     const data = message.value
//       ? JSON.parse(message.value.toString())
//       : message;
    
//     console.log('messages received in order consumer', data);

//   }
// }
