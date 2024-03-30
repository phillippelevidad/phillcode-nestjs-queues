import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { EntityBase } from 'src/common/entities/entity-base';
import { ManagerAssignedEvent } from '../events/manager-assigned/manager-assigned.event';

@Entity()
export class Employee extends EntityBase {
  #manager?: Employee;
  #managerId?: number;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
  @JoinColumn()
  get manager(): Employee | undefined {
    return this.#manager;
  }
  set manager(value: Employee | undefined) {
    this.managerId = value?.managerId;
    this.#manager = value;
  }

  @Column({ nullable: true })
  get managerId(): number | undefined {
    return this.#managerId;
  }
  set managerId(value: number | undefined) {
    if (value && value !== this.#managerId) {
      this.addEvent(new ManagerAssignedEvent(this.id, value));
    }
    this.#managerId = value;
  }

  @OneToOne(() => ContactInfo, { cascade: true })
  @JoinColumn()
  contactInfo?: ContactInfo;
}
