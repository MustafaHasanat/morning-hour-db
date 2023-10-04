import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { deleteFile, deleteFiles } from 'src/utils/storageProcess/deleteFiles';
import { filterNullsObject } from 'src/utils/helpers/filterNulls';
import { AuthorFields } from 'src/enums/sorting-fields.enum';
import { GetAllProps } from 'src/types/get-operators.type';
import { AppService } from 'src/app.service';
import { CustomResponseType } from 'src/types/custom-response.type';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly appService: AppService,
  ) {}
  // @Inject(forwardRef(() => ItemsService))
  // private readonly itemsService: ItemsService,

  async getAuthors({
    sortBy = AuthorFields.NAME,
    reverse = false,
    page = 1,
    conditions,
  }: GetAllProps<AuthorFields>): Promise<CustomResponseType<Author[]>> {
    try {
      const findQuery = this.appService.filteredGetQuery({
        conditions,
        sortBy,
        page,
        reverse,
      });

      if (findQuery.status !== 200) {
        return {
          message: findQuery.message,
          data: null,
          status: findQuery.status,
        };
      }

      const response = await this.authorRepository.find(findQuery.data);

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

  async getAuthorById(id: string): Promise<CustomResponseType<Author>> {
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

  async createAuthor(
    createAuthorDto: CreateAuthorDto,
  ): Promise<CustomResponseType<Author>> {
    try {
      const newAuthor = this.authorRepository.create({
        ...createAuthorDto,
        image: createAuthorDto?.image?.filename || '',
      });
      const response = await this.authorRepository.save(newAuthor);

      return {
        message: 'Author has been created successfully',
        data: response,
        status: 201,
      };
    } catch (error) {
      return {
        message: 'Error occurred',
        data: error,
        status: 500,
      };
    }
  }

  async updateAuthor(
    id: string,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<CustomResponseType<UpdateResult>> {
    try {
      const author = await this.getAuthorById(id);
      if (!author) {
        return {
          message: `Author '${id}' doesn't exist`,
          data: null,
          status: 404,
        };
      }

      const response = await this.authorRepository.update(
        {
          id,
        },
        filterNullsObject({
          ...updateAuthorDto,
          image: updateAuthorDto?.image?.filename,
        }),
      );

      return {
        message: 'Author has been updated successfully',
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

  async deleteAllAuthors(): Promise<CustomResponseType<DeleteResult>> {
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

  async deleteAuthor(id: string): Promise<CustomResponseType<DeleteResult>> {
    try {
      const author = await this.getAuthorById(id);
      if (author.status === 404) {
        return {
          message: `Author ${id} doesn't exist`,
          data: null,
          status: 404,
        };
      }

      const response = await this.authorRepository.delete(id);

      // delete the image related to the file
      author?.data?.image &&
        deleteFile('./public/assets/authors/' + author?.data?.image);

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
