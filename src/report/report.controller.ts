import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';


@Controller('/api/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}


  @Get(':mc_code')
  findOne(
    @Param('mc_code') mc_code: string,
    @Query('startdate') startdate: string,
    @Query('enddate') enddate: string,
    @Query('tablename') tablename: string
  
  ) {
   
    if (!mc_code || !startdate || !enddate || !tablename) {
      throw new BadRequestException('Missing Parameter');
    }
     
    return this.reportService.findByMccode(mc_code,startdate,enddate,tablename);
  }

}
