import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private report: Repository<Report>) {}

  create(reportDto: CreateReportDto) {
    const report = this.report.create(reportDto);

    return this.report.save(report);
  }
}
