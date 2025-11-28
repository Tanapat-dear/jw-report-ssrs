import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ReportService {
 
  constructor(@InjectDataSource('jwdb_10_17_66_146') private dataSource: DataSource) {}
  

  async findByMccode(
      mc_code: string,
      start: string,
      end: string,
      tablename: string,
    ) {
        if (!mc_code || !start|| !end|| !tablename) {
              throw new BadRequestException('Missing Parameter');
            }
           
      try {
        
        const sample = await this.dataSource.query(`SELECT * FROM "${tablename}" LIMIT 1`);
        const cols = sample.length ? Object.keys(sample[0]) : [];
        const hasMC = cols.includes('mc_code');
        
     const selectCols = [
          hasMC ? 'mc_code' : `'${mc_code}' AS mc_code`,
          ...cols.filter(c => c !== 'mc_code').map(c => {
            const val = sample[0][c];
            if (val instanceof Date) {
              return `TO_CHAR(${c}, 'YYYY-MM-DD HH24:MI:SS') AS ${c}`;
            }
            return c;
          })
        ].join(', ');

          
        
        const whereParts = hasMC
          ? ['mc_code = $1', 'ptime >= $2::timestamp', 'ptime <= $3::timestamp']
          : ['ptime >= $1::timestamp', 'ptime <= $2::timestamp'];

        const endDateTime = end + ' 23:59:59';
        const params = hasMC ? [mc_code, start, endDateTime] : [start, endDateTime];

        const sql = ` SELECT ${selectCols} FROM "${tablename}" WHERE ${whereParts.join(' AND ')} ORDER BY ptime ASC`;

        const result = await this.dataSource.query(sql, params);

        return { status: 'OK', data: result };
        
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Internal server error');
      }
}

  
}
