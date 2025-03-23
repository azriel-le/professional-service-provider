import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Hire } from '../hire/hire.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Hire)
    private hireRepository: Repository<Hire>,
  ) {}

  // Fetch platform statistics
  async getPlatformStatistics(): Promise<any> {
    const totalClients = await this.userRepository.count({ where: { user_type: 'client' } });
    const totalFreelancers = await this.userRepository.count({ where: { user_type: 'freelancer' } });
    const totalHireRequests = await this.hireRepository.count();

    const activeHireRequests = await this.hireRepository.count({ where: { status: 'Accepted' } });
    const pendingHireRequests = await this.hireRepository.count({ where: { status: 'Pending' } });
    const completedHireRequests = await this.hireRepository.count({ where: { status: 'Completed' } });

    return {
      totalClients,
      totalFreelancers,
      totalHireRequests,
      activeHireRequests,
      pendingHireRequests,
      completedHireRequests,
    };
  }

  // Fetch user activity reports
 // async getUserActivityReports(): Promise<any> {
   // const mostActiveClients = await this.userRepository.find({
     // where: { user_type: 'client' },
     // order: { last_login: 'DESC' },
      //take: 5,
    //});

    //const mostActiveFreelancers = await this.userRepository.find({
     // where: { user_type: 'freelancer' },
      //order: { last_login: 'DESC' },
      //take: 5,
    //});

    ///return { mostActiveClients, mostActiveFreelancers };
  //}
}