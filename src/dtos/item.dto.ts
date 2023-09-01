// import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty } from 'class-validator';
// import { Author } from 'src/entities';
// import { CategoryModel } from 'src/models/category.model';

// export class ItemDto {
//   @IsNotEmpty()
//   @ApiProperty({ example: 'username' })
//   title: string;

//   @IsNotEmpty()
//   @ApiProperty({ example: 'username' })
//   description: string;

//   @IsNotEmpty()
//   @ApiProperty({ example: 'username' })
//   currentPrice: number;

//   @IsNotEmpty()
//   @ApiProperty({ example: 'username' })
//   oldPrice: number;

//   @IsNotEmpty()
//   @ApiProperty({ example: 'username' })
//   isBestSelling: boolean;

//   @IsNotEmpty()
//   @ApiProperty({ example: 'username' })
//   primaryColor: string;

//   @IsNotEmpty()
//   @ApiProperty({ example: 'username' })
//   category: CategoryModel;

//   @IsNotEmpty()
//   @ApiProperty({ example: 'username' })
//   author: Author;

//   @IsNotEmpty()
//   @ApiProperty({
//     type: 'string[]',
//     format: 'binary',
//     example: 'url',
//   })
//   image: string;

//   @IsNotEmpty()
//   @ApiProperty({
//     type: 'string[]',
//     format: 'binary',
//     example: 'url',
//   })
//   screenshots: string[];
// }

// export const itemBody = {
//   schema: {
//     type: 'object',
//     properties: {
//       title: { type: 'string' },
//       description: { type: 'string' },
//       currentPrice: { type: 'number' },
//       oldPrice: { type: 'number' },
//       isBestSelling: { type: 'boolean' },
//       primaryColor: { type: 'string' },
//       // category: {
//       //   type: 'object',
//       //   properties: {
//       //     title: 'string',
//       //     image: 'string',
//       //   },
//       // },
//       // author: { type: 'author' },
//       image: {
//         type: 'string',
//         format: 'binary',
//       },
//       screenshots: {
//         type: 'string[]',
//         format: 'binary',
//       },
//     },
//   },
// };
