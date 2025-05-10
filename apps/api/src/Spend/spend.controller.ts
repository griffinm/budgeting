import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@budgeting/api/auth";
import { RequestWithUser } from "@budgeting/types";
import { SpendSearchDto } from "./dto/spend-search.dto";
import { SpendService } from "./spend.service";
import { SpendSummaryDto } from "./dto/spend-summary.dto";
import { plainToInstance } from "class-transformer";

@Controller('spend')
@UseGuards(AuthGuard)
export class SpendController {
  constructor(private readonly spendService: SpendService) {}

  @Get()
  async getSpend(
    @Req() req: RequestWithUser,
    @Query() query: SpendSearchDto,
  ) {
    const data = await this.spendService.getSpend({
      accountId: req.user.accountId,
      searchDto: query,
    });

    return plainToInstance(SpendSummaryDto, data);
  }
}
