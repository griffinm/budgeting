import { 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Req, 
  Body 
} from "@nestjs/common";
import { ConnectedAccountsService } from "./connected-accounts.service";
import { AuthGuard } from "@budgeting/api/auth";
import { RequestWithUser } from "@budgeting/types";
import { ConnectedAccountEntity } from "./dto/connected-account.entity";
import { ExchangeTokenDto } from "./dto/exchange-token.dto";

@Controller('connected-accounts')
@UseGuards(AuthGuard)
export class ConnectedAccountsController {
  constructor(
    private readonly connectedAccountsService: ConnectedAccountsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: RequestWithUser,
  ): Promise<ConnectedAccountEntity[]> {
    return this.connectedAccountsService.findAll(req.user.id);
  }

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() exchangeTokenDto: ExchangeTokenDto,
  ): Promise<ConnectedAccountEntity[]> {
    return this.connectedAccountsService.exchangeTokenAndCreate(
      req.user.id,
      req.user.accountId,
      exchangeTokenDto
    );
  }
}
