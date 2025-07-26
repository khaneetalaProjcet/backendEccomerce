import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { JwtAdminAuthGuard } from 'src/jwt/admin-jwt-auth.guard';
import { ProductItems } from './entities/productItems.entity';
import { CreateProductItemDto } from './dto/create-productItem.dto';
import { UpdateProductItemDto } from './dto/update-productItem.dto';
import { query } from 'winston';
import { productListQueryDto } from './dto/pagination.dto';
import { ProductFilterDto } from './dto/productFilterdto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [Product],
  })
  findAll(@Query() query: ProductFilterDto) {
    return this.productService.findAll(query);
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post('update/:id')
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Get('remove/:id')
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Post('item/create')
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductItemDto })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductItems,
  })
  createItem(@Body() createProductDto: CreateProductItemDto) {
    return this.productService.createProductItems(createProductDto);
  }
  @Post('item/update/:id')
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'updating each items of the product' })
  @ApiBody({ type: UpdateProductItemDto })
  @ApiResponse({
    status: 201,
    description: 'The items of the product successfully updated',
    type: ProductItems,
  })
  updateItem(
    @Param('id') id: string,
    @Body() updateProductDtoItemDto: UpdateProductItemDto,
  ) {
    return this.productService.updateProductItems(id, updateProductDtoItemDto);
  }

  @Get('item/remove/:id/:pid')
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: UpdateProductItemDto })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductItems,
  })
  removeItem(@Param('id') id: string, @Param('pid') productId: string) {
    return this.productService.removeProductItems(id, productId);
  }

  @Get('category/:categoryId')
  // @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'get product based on category' })
  async getProductBasedOnCategory(
    @Req() req: any,
    @Res() res: any,
    @Query() query: ProductFilterDto,
    @Param('categoryId') categoryId: string,
  ) {
    return this.productService.getProductBasedOnCategory(categoryId, query);
  }

  @Get('/filter-by-price')
  @ApiOperation({ summary: 'Get products based on price' })
  @ApiResponse({
    status: 200,
    description: 'List of products base on price',
    type: [Product],
  })
  filterByPrice(@Query() query: ProductFilterDto) {
    return this.productService.filterProductsByPrice(query);
  }

  @Get('/filterByAttributes')
  @ApiOperation({ summary: 'Get products based on attributes' })
  @ApiBody({ type: ProductFilterDto })
  @ApiResponse({
    status: 200,
    description: 'List of products base on price weight color and size ',
    type: [Product],
  })
  filteredProduct(@Query() query: ProductFilterDto) {
    return this.productService.filterProductsByAttributes(query);
  }

  @Get('/topSelling')
  @ApiOperation({ summary: 'Get top selling products' })
  @ApiResponse({
    status: 200,
    description: 'List of top selling products',
    type: [Product],
  })
  filterTopSelling(@Query() query: ProductFilterDto) {
    return this.productService.findAll(query);
  }

  // @Patch('/discount/:id')
  // @ApiOperation({ summary: 'add discount percent to the product' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'successsfully added',
  //   type: [Product],
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'internal error',
  //   type: [Product],
  // })
  // addDiscount(
  //   @Param() productId: string,
  //   @Query() query: UpdateProductItemDto,
  // ) {
  //   return this.productService.addDiscount(productId, query);
  // }

  @Get('/recommendations')
  @ApiOperation({ summary: 'get recommending products' })
  @ApiResponse({
    status: 200,
    description: 'List of recommending products',
    type: [Product],
  })
  recommending(@Query() query: ProductFilterDto) {
    return this.productService.findAll(query);
  }

  @Get('/summary')
  @ApiOperation({})
  @ApiResponse({})
  summary() {
    return this.productService.getSummary();
  }

  @Delete('/')
  delete() {
    return this.productService.delete();
  }
}
