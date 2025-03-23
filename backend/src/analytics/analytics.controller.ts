import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('statistics')
  async getPlatformStatistics() {
    return this.analyticsService.getPlatformStatistics();
  }

  //@Get('user-activity')
  //async getUserActivityReports() {
   // return this.analyticsService.getUserActivityReports();
  //}
}