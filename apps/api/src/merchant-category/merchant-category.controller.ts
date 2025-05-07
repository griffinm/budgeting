import { Controller, Get, Param, Logger, UseGuards } from "@nestjs/common";
import { MerchantCategoryService } from "./merchant-category.service";
import { MerchantCategory } from "@prisma/client";
// Assuming you have an AuthGuard, e.g., JwtAuthGuard. Adjust if necessary.
// import { JwtAuthGuard } from "../auth/jwt-auth.guard"; 

@Controller("merchant-categories") // Base path for this controller
// @UseGuards(JwtAuthGuard) // Apply to all routes in this controller if needed
export class MerchantCategoryController {
  private readonly logger = new Logger(MerchantCategoryController.name);

  constructor(private readonly merchantCategoryService: MerchantCategoryService) {}

  @Get("/account/:accountId")
  // @UseGuards(JwtAuthGuard) // Or apply guard at the route level
  async findAllByAccountId(
    @Param("accountId") accountId: string,
  ): Promise<MerchantCategory[]> {
    this.logger.log(
      `Received request to get all merchant categories for account ${accountId}`,
    );
    return this.merchantCategoryService.findAllByAccountId(accountId);
  }

  // Placeholder for other potential endpoints, e.g.:
  // @Get(":id/account/:accountId")
  // findOne(@Param("id") id: string, @Param("accountId") accountId: string) { ... }
  // @Post("/account/:accountId")
  // create(@Param("accountId") accountId: string, @Body() createDto: any) { ... }
  // @Patch(":id/account/:accountId")
  // update(@Param("id") id: string, @Param("accountId") accountId: string, @Body() updateDto: any) { ... }
  // @Delete(":id/account/:accountId")
  // remove(@Param("id") id: string, @Param("accountId") accountId: string) { ... }
} 