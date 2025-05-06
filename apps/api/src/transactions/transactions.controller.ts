import { 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Req, 
  Query,
  Param
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { AuthGuard } from "@budgeting/api/auth";
import { PagedResponse, RequestWithUser } from "@budgeting/types";
import { AccountTransactionEntity } from "./dto/transaction.entity";
import { plainToInstance } from "class-transformer";
import { TransactionFilter } from "./dto/transaction-filter";
import { PagedRequestDto } from "../common/dto/paged-request.dto";

@Controller()
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get('/transactions')
  async findAllForAccount(
    @Req() req: RequestWithUser,
    @Query() pageRequest: PagedRequestDto,
    @Query() filter: TransactionFilter,
  ): Promise<PagedResponse<AccountTransactionEntity>> {
    const transactions = await this.transactionsService.searchTransactions({ 
      accountId: req.user.accountId, 
      startDate: filter.startDate,
      endDate: filter.endDate,
      merchantId: filter.merchantId,
      connectedAccountId: filter.connectedAccountId,
      page: pageRequest.page, 
      pageSize: pageRequest.pageSize,
    });

    const transactionsEntites = plainToInstance(AccountTransactionEntity, transactions.data);

    return {
      data: transactionsEntites,
      totalRecords: transactions.totalRecords,
      currentPage: transactions.currentPage,
      pageSize: transactions.pageSize,
    };
  }

  @Post('transactions/sync')
  async syncTransactions(
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean }> {
    await this.transactionsService.syncTransactions({ accountId: req.user.accountId });
    return { success: true };
  }
}
