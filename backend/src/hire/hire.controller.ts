import { Controller, Post, Body, Get, Param, Put, ParseIntPipe } from '@nestjs/common';
import { HireService } from './hire.service';
import { CreateHireDto } from './hire/dto/create-hire.dto';
import { UpdateHireStatusDto } from './hire/dto/update-hire-status.dto';

@Controller('hire')
export class HireController {
  constructor(private readonly hireService: HireService) {}

  // Create a hire request
  @Post()
  async createHireRequest(@Body() createHireDto: CreateHireDto) {
    console.log("🔵 Creating hire request:", createHireDto);
    const result = await this.hireService.createHireRequest(createHireDto);
    console.log("✅ Hire request created:", result);
    return result;
  }

  // Fetch all hire requests
  @Get()
  async getAllHireRequests() {
    console.log("🔵 Fetching all hire requests");
    const requests = await this.hireService.getAllHireRequests();
    console.log("✅ All Hire Requests Found:", requests);
    return requests;
  }

  // Fetch hire requests for a freelancer
  @Get('freelancer/:freelancerId')
  async getHireRequestsByFreelancer(@Param('freelancerId', ParseIntPipe) freelancerId: number) {
    console.log(`🔵 Fetching hire requests for freelancer ID: ${freelancerId}`);
    const requests = await this.hireService.getHireRequestsByFreelancer(freelancerId);
    console.log("✅ Hire Requests Found:", requests);
    return requests;
  }

  // Fetch hire requests for a client
  @Get('user/:userId')
  async getHireRequestsByClient(@Param('userId', ParseIntPipe) userId: number) {
    console.log(`🔵 Fetching hire requests for user ID: ${userId}`);
    const requests = await this.hireService.getHireRequestsByClient(userId);
    console.log("✅ Client Hire Requests:", requests);
    return requests;
  }

  // Update the status of a hire request
  @Put(':id/status')
  async updateHireStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHireStatusDto: UpdateHireStatusDto
  ) {
    console.log(`🔵 Updating hire request ID ${id} with status:`, updateHireStatusDto);
    const updatedRequest = await this.hireService.updateHireStatus(id, updateHireStatusDto);
    console.log("✅ Hire Request Updated:", updatedRequest);
    return updatedRequest;
  }
}