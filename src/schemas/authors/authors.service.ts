import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  getAllAuthors() {
    return this.authorRepository.find();
  }

  getAuthorById(id: string) {
    return this.authorRepository.findOneBy({ id });
  }

  downloadImage(imageName: string) {
    return join(process.cwd(), 'uploads/authors/' + imageName);
  }

  createAuthor(createAuthorDto: CreateAuthorDto) {
    const newAuthor = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(newAuthor);
  }

  updateAuthor(id: string, updateAuthorDto: UpdateAuthorDto) {
    return this.authorRepository.update(
      {
        id,
      },
      {
        ...updateAuthorDto,
      },
    );
  }

  deleteAllAuthors() {
    return this.authorRepository.clear();
  }

  deleteAuthor(id: string) {
    return this.authorRepository.delete(id);
  }
}
