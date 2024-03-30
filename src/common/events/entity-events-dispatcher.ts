import { EventBus } from '@nestjs/cqrs';
import { EntityBase } from '../entities/entity-base';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityEventsDispatcher {
  constructor(private readonly eventBus: EventBus) {}

  async dispatch(entity: EntityBase): Promise<void> {
    await Promise.all(entity.getEvents().map((e) => this.eventBus.publish(e)));
    entity.clearEvents();
  }
}
