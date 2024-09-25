import { 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Req, 
  Body, 
  Param,
  Patch
} from "@nestjs/common";
import { ConnectedAccountsService } from "./connected-accounts.service";
import { AuthGuard } from "@budgeting/api/auth";
import { RequestWithUser } from "@budgeting/types";
import { ConnectedAccountEntity } from "./dto/connected-account.entity";
import { ExchangeTokenDto } from "./dto/exchange-token.dto";
import { plainToInstance } from "class-transformer";
import { UpdateConnectedAccountDto } from "./dto/update.dto";

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
    const accounts = await this.connectedAccountsService.findAll({
      accountId: req.user.accountId,
    });

    return plainToInstance(ConnectedAccountEntity, accounts);
  }

  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateConnectedAccountDto: UpdateConnectedAccountDto,
  ): Promise<ConnectedAccountEntity> {
    const account = await this.connectedAccountsService.update({
      accountId: req.user.accountId,
      connectedAccountId: id,
      updateConnectedAccountDto,  
    });

    return plainToInstance(ConnectedAccountEntity, account);
  }

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() exchangeTokenDto: ExchangeTokenDto,
  ): Promise<ConnectedAccountEntity[]> {
    const accounts = await this.connectedAccountsService.exchangeTokenAndCreate({
      accountId: req.user.accountId,
      exchangeTokenDto,
    });

    return plainToInstance(ConnectedAccountEntity, accounts);
  }
}
