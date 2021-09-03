import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }
  async getTasksById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with Id "${id} not Found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task With Id "${id}" not fount`);
    }
  }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTasksById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
