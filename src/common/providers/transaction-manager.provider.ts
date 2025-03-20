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
    callback: (querryRunner: QueryRunner) => Promise<T>,
  ) {
    const querryRunner = this.dataSource.createQueryRunner();

    await querryRunner.connect();

    await querryRunner.startTransaction();

    try {
      const result = await callback(querryRunner);

      await querryRunner.commitTransaction();

      return result;
    } catch (error) {
      await querryRunner.rollbackTransaction();
      throw new BadRequestException(String(error));
    } finally {
      await querryRunner.release();
    }
  }
}
