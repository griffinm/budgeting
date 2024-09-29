import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@budgeting/api/auth';
import { BalanceService } from './balance.service';
import { GetCumlativeMonthlySpendDto } from './dto/get-cumlative-monthly-spend.dto';
import { DailySpend, RequestWithUser } from '@budgeting/types';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('cumlative-daily-spend')
  @UseGuards(AuthGuard)
  async getCumlativeDailySpend(
    @Req() req: RequestWithUser,
    @Query() query: GetCumlativeMonthlySpendDto,
  ): Promise<DailySpend[]> {
    const month = parseInt(query.month) - 1;
    const year = parseInt(query.year);
    const date = new Date(year, month, 1);

    return await this.balanceService.cumlativeDailySpendForMonth({
      accountId: req.user.accountId,
      date,
    });
  }
}
