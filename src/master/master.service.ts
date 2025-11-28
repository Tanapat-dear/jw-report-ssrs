import { BadGatewayException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class MasterService {

  constructor(@InjectDataSource('masterdb_10_17_77_118') private dataSource: DataSource) {}
  create(createMasterDto: CreateMasterDto) {
    return ;
  }

  async findAll() {
    try {
      const querydata = await this.dataSource.query(
        'SELECT * FROM jw_report_master_table' 
      );
      return {status:'OK',data: querydata};
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch Data')
    }
  }


   async findbyProcess(process : string) {
    try {
      
        const querydata = await this.dataSource.query(
          `SELECT * FROM jw_report_master_table WHERE process_group LIKE $1`,
          [`%${process.toUpperCase()}`]
        );
   

      if (querydata.length === 0){
        throw new NotFoundException('Data Not Found')
      }

      return {status:'OK',process ,data: querydata};

    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch Data')
    }
  }


  update(id: number, updateMasterDto: UpdateMasterDto) {
    return `This action updates a #${id} master`;
  }

  remove(id: number) {
    return `This action removes a #${id} master`;
  }
}
