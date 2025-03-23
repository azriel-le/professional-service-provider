import { Controller, Post, Body, HttpException, HttpStatus, Sse, MessageEvent } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './job/dto/create-job.dto';
import { Job } from './job.entity';
import { Observable } from 'rxjs';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto): Promise<{ message: string; job: Job }> {
    try {
      const job = await this.jobService.createJob(createJobDto);
      return { message: 'Job posted successfully!', job };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Sse('subscribe')
  subscribeToJobAlerts(): Observable<MessageEvent> {
    return new Observable((observer) => {
      const eventSource = new EventSource('http://localhost:5000/jobs/subscribe');

      eventSource.onmessage = (event) => {
        const newJob = JSON.parse(event.data);
        observer.next({ data: newJob });
      };

      eventSource.onerror = (error) => {
        observer.error(error);
      };

      return () => eventSource.close();
    });
  }
}