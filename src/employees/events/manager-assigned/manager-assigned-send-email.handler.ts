import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ManagerAssignedEvent } from './manager-assigned.event';
import { DataSource } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { Job, Queue } from 'bull';
import { InjectQueue, Process, Processor } from '@nestjs/bull';

@EventsHandler(ManagerAssignedEvent)
@Processor('employees')
export class ManagerAssigned_SendEmailHandler
  implements IEventHandler<ManagerAssignedEvent>
{
  constructor(
    private readonly dataSource: DataSource,
    @InjectQueue('employees')
    private readonly queue: Queue,
  ) {}

  async handle(event: ManagerAssignedEvent) {
    await this.queue.add('manager-assigned-send-email', event);
  }

  @Process('manager-assigned-send-email')
  async process(job: Job<ManagerAssignedEvent>) {
    console.log(`Attempt #${job.attemptsMade}`);

    const event = job.data;
    const manager = await this.dataSource.manager.findOne(Employee, {
      where: { id: event.managerId },
      relations: ['contactInfo'],
    });

    if (!manager.contactInfo?.email) return;

    const employee = await this.dataSource.manager.findOne(Employee, {
      where: { id: event.employeeId },
    });

    if (job.attemptsMade === 0) {
      throw new Error('Failed to send email');
    }

    // send email
    console.log(
      `Send email to ${manager.name}, saying that ${employee.name} has joined their team." `,
    );
  }
}
