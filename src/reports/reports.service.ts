import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private report: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.report.create(reportDto);
    report.user = user;

    return this.report.save(report);
  }
}
