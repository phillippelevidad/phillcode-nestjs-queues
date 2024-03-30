import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { CommonModule } from 'src/common/common.module';
import { BullModule } from '@nestjs/bull';
import { QueueConsumers } from './queues';

@Module({
  imports: [
    CqrsModule,
    BullModule.registerQueue({ name: 'employees' }),
    BullModule.registerQueue({ name: 'webhooks' }),
    TypeOrmModule.forFeature([Employee, ContactInfo]),
    CommonModule,
  ],
  controllers: [EmployeesController],
  providers: [
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueueConsumers,
  ],
})
export class EmployeesModule {}
