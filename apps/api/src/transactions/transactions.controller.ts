import { 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Req, 
  Query
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { AuthGuard } from "@budgeting/api/auth";
import { PagedRequest, PagedResponse, RequestWithUser } from "@budgeting/types";
import { AccountTransactionEntity } from "./dto/transaction.entity";
import { plainToInstance } from "class-transformer";
import { TransactionFilter } from "./dto/transaction-filter";

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  async findAllForAccount(
    @Req() req: RequestWithUser,
    @Query() pageRequest: PagedRequest,
    @Query() filter: TransactionFilter,
  ): Promise<PagedResponse<AccountTransactionEntity>> {
    const transactions = await this.transactionsService.findAllForAccount({ 
      accountId: req.user.accountId, 
      page: pageRequest.page, 
      pageSize: pageRequest.pageSize,
      filter,
    });

    const transactionsEntites = plainToInstance(AccountTransactionEntity, transactions.data);

    return {
      data: transactionsEntites,
      totalRecords: transactions.totalRecords,
      currentPage: transactions.currentPage,
      pageSize: transactions.pageSize,
    };
  }

  @Post('/sync')
  async syncTransactions(
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean }> {
    await this.transactionsService.syncTransactions({ accountId: req.user.accountId });
    return { success: true };
  }
}
