import { Global, Module } from '@nestjs/common';
import { MessageGateway } from './websocket.gateway';

@Global()
@Module({
  providers: [MessageGateway],
  exports: [MessageGateway],
})
export class WebsocketModule {}
