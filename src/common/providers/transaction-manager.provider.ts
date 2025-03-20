import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionManagerProvider {
  constructor(
    /**
     * inject dataSource
     */
    private readonly dataSource: DataSource,
  ) {}

  public async transaction<T>(
    callback: (queryRunner: QueryRunner) => Promise<T>,
  ) {
    const instanceQueryRuner = this.dataSource.createQueryRunner();

    await instanceQueryRuner.connect();

    await instanceQueryRuner.startTransaction();

    try {
      const result = await callback(instanceQueryRuner);

      await instanceQueryRuner.commitTransaction();

      return result;
    } catch (error) {
      await instanceQueryRuner.rollbackTransaction();
      throw new BadRequestException(String(error));
    } finally {
      await instanceQueryRuner.release();
    }
  }
}
