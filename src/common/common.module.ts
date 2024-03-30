import { Module } from '@nestjs/common';
import { EntityEventsDispatcher } from './events/entity-events-dispatcher';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [EntityEventsDispatcher],
  exports: [EntityEventsDispatcher],
})
export class CommonModule {}
