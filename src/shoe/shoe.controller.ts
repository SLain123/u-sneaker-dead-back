import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  UseGuards,
  HttpCode,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ShoeDto, UpdateShoeDTO } from './shoe.dto';
import { ShoeService } from './shoe.service';

import { JwtAuthGuard } from '../global/guards/jwt.guard';
import { UserData } from '../global/decorators/user.decorator';
import { IdValidationPipe } from '../global/pipes/id-validation.pipe';
import {
  PaginationParams,
  Pagination,
} from '../global/pipes/pagination-params.pipe';
import { UserIndentifaer } from '../user/user.dto';

@ApiTags('Shoes')
@Controller('shoe')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @Body() dto: ShoeDto,
    @UserData() { userEmail }: UserIndentifaer,
  ) {
    return this.shoeService.createShoe(userEmail, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Get('all')
  async getAllUserShoes(
    @UserData() { userId }: UserIndentifaer,
    @PaginationParams() paginationParams: Pagination,
    @Query('active') active?: 'true' | 'false',
  ) {
    return this.shoeService.findAllUserShoesWithPaginate(
      userId,
      paginationParams,
      active,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Get(':id')
  async getShoe(
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    const shoe = await this.shoeService.findShoe(id);
    await this.shoeService.checkShoeOwner(userId, String(shoe.user));

    return shoe;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async updateShoe(
    @Body() dto: UpdateShoeDTO,
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    const updatedShoe = await this.shoeService.updateShoe(userId, id, dto);
    const currentDurability = await this.shoeService.calculateDurability(id);

    return Object.assign(updatedShoe, currentDurability);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async removeShoe(
    @Param('id', IdValidationPipe) id: string,
    @UserData() { userId }: UserIndentifaer,
  ) {
    return this.shoeService.removeShoe(userId, id);
  }
}
