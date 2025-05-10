import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MerchantCategory } from "@prisma/client";
import { CreateMerchantCategoryDto } from "./dto/create.dto";

const COLORS = [
  "#FF6B6B", // Soft Red
  "#F7B32B", // Warm Gold
  "#6BCB77", // Fresh Green
  "#4D96FF", // Sky Blue
  "#845EC2", // Soft Violet
  "#00C9A7", // Teal
  "#FFC75F", // Light Amber
  "#C34A36", // Brick
  "#FF9671", // Peach
  "#0081CF", // Deep Blue
  "#B39CD0", // Lavender
  "#3C486B", // Slate Blue
  "#FFD6A5", // Apricot
  "#D9D7F1", // Mist Purple
  "#6A994E", // Earthy Green
  "#F9F871", // Soft Yellow
  "#FFB5A7", // Blush
  "#A1C298", // Sage
  "#9ADCFF", // Light Cyan
  "#FFB627"  // Bright Amber
];

@Injectable()
export class MerchantCategoryService {
  private readonly logger = new Logger(MerchantCategoryService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async findAllByAccountId(accountId: string): Promise<MerchantCategory[]> {
    this.logger.log(`Fetching all merchant categories for account ${accountId}`);
    return this.prismaService.merchantCategory.findMany({
      where: {
        accountId,
      },
      orderBy: {
        name: "asc",
      }
    });
  }

  public async create({
    accountId,
    createMerchantCategoryDto,
  }: {
    accountId: string;
    createMerchantCategoryDto: CreateMerchantCategoryDto;
  }): Promise<MerchantCategory> {
    this.logger.log(`Creating merchant category ${createMerchantCategoryDto.name} for account ${accountId}`);
    return this.prismaService.merchantCategory.create({
      data: {
        ...createMerchantCategoryDto,
        accountId,
        color: await this.generateColor({ accountId }),
      },
    });
  }

  private async generateColor({ accountId }: { accountId: string }): Promise<string> {
    const existingCategories = await this.prismaService.merchantCategory.findMany({
      where: {
        accountId,
      },
      select: {
        color: true,
      },
    });
    const existingColors = existingCategories.map((category) => category.color);
    const availableColors = COLORS.filter((color) => !existingColors.includes(color));
    return availableColors[0];
  }
} 
