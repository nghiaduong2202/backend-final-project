import { Global, Module } from '@nestjs/common';
import { TransactionManagerProvider } from './providers/transaction-manager.provider';

@Global()
@Module({
  providers: [TransactionManagerProvider],
  exports: [TransactionManagerProvider],
})
export class CommonModule {}
