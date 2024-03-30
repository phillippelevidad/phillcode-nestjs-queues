import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Processor('webhooks')
export class WebhooksConsumer {
  constructor() {}

  @Process('process-payment')
  processPayment(job: Job<ProcessPaymentDto>) {
    console.log(`Attempt #${job.attemptsMade}`);

    if (job.attemptsMade === 0) {
      throw new Error('Failed on first attempt');
    }

    // Processamento aqui...
    console.log('Payment webhook received', job.data);
  }
}
