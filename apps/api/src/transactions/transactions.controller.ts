import { 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Req, 
  Body, 
  Param,
  Query
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { AuthGuard } from "@budgeting/api/auth";
import { PagedResponse, RequestWithUser } from "@budgeting/types";
import { ConnectedAccountsService } from "@budgeting/api/connected-accounts";
import { AccountTransactionEntity } from "./dto/transaction.entity";

@Controller()
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly connectedAccountsService: ConnectedAccountsService,
  ) {}

  @Post('accounts/:accountId/transactions/sync')
  async syncTransactions(
    @Req() req: RequestWithUser,
    @Param('accountId') connectedAccountId: string,
  ): Promise<void> {
    const currentCursor = await this.connectedAccountsService.lastCursor(req.user.id, connectedAccountId);
    await this.transactionsService.syncTransactions(req.user.id, connectedAccountId, currentCursor);
  }

  @Get('transactions')
  async getTransactions(
    @Req() req: RequestWithUser,
    @Query('accountId') connectedAccountId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 50,
  ): Promise<PagedResponse<AccountTransactionEntity>> {
    return await this.transactionsService.getTransactions({
      userId: req.user.id,
      connectedAccountId,
      page,
      pageSize,
    });
  }
}
