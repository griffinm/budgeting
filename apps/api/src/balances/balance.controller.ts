import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@budgeting/api/auth';
import { BalanceService } from './balance.service';
import { GetCumlativeMonthlySpendDto } from './dto/get-cumlative-monthly-spend.dto';
import { DailySpend, MonthlyTotalResponse, RequestWithUser } from '@budgeting/types';
import { GetMonthlyTotalDto } from './dto/get-month-total.dto';

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

  @Get('monthly-total')
  @UseGuards(AuthGuard)
  async getMonthlyTotal(
    @Req() req: RequestWithUser,
    @Query() query: GetMonthlyTotalDto,
  ): Promise<MonthlyTotalResponse> {
    const amount= await this.balanceService.totalMonthySpend({
      accountId: req.user.accountId,
      monthNumber: parseInt(query.month),
      year: parseInt(query.year),
      type: query.type,
    });

    return { amount };
  }
}
