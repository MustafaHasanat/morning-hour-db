import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ItemsService } from '../items/items.service';
import { deleteFile, deleteFiles } from 'src/utils/storageProcess/deleteFiles';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,

    @Inject(forwardRef(() => ItemsService))
    private readonly itemsService: ItemsService,
  ) {}

  async getAuthors(conditions: Record<string, any>) {
    try {
      const response = await this.authorRepository.findBy(conditions);

      return {
        message: response.length
          ? 'Authors have been found'
          : 'Authors list is empty',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async getAuthorById(id: string) {
    try {
      const response = await this.authorRepository.findOneBy({ id });
      return {
        message: response ? 'Author has been found' : "Author doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  downloadImage(imageName: string) {
    try {
      const response = join(
        process.cwd(),
        'public/assets/authors/' + imageName,
      );
      return {
        message: response
          ? 'Image returned successfully'
          : "Author doesn't exist",
        data: response,
        status: response ? 200 : 404,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async createAuthor(createAuthorDto: CreateAuthorDto) {
    try {
      const newAuthor = this.authorRepository.create({
        ...createAuthorDto,
        image: createAuthorDto.image.filename && '',
      });
      const response = await this.authorRepository.save(newAuthor);

      return {
        message: 'Author has been created successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }

  async updateAuthor(id: string, updateAuthorDto: UpdateAuthorDto) {
    try {
      const response = await this.authorRepository.update(
        {
          id,
        },
        {
          ...updateAuthorDto,
          image: updateAuthorDto.image.filename && '',
        },
      );

      const isAuthorExist = response.affected !== 0;

      return {
        message: isAuthorExist
          ? 'Author has been updated successfully'
          : "Author doesn't exist",
        data: response,
        status: isAuthorExist ? 200 : 404,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }

  async deleteAllAuthors() {
    try {
      const response = await this.authorRepository.query(
        'TRUNCATE TABLE author CASCADE;',
      );

      // delete all files in the dir
      deleteFiles('./public/assets/authors/');

      return {
        message: 'Authors data are wiped out',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }

  async deleteAuthor(id: string) {
    try {
      const author = await this.getAuthorById(id);
      if (author.status === 404) {
        return {
          message: "Author doesn't exist",
          data: author,
          status: 404,
        };
      }

      const imageName = author?.data?.image;
      const response = await this.authorRepository.delete(id);

      // delete the image related to the file
      deleteFile('./public/assets/authors/' + imageName);

      return {
        message: 'Author has been deleted successfully',
        data: response,
        status: 200,
      };
    } catch (error) {
      return { message: 'Error occurred', data: error, status: 500 };
    }
  }
}
