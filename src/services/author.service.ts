import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthorDto } from 'src/dtos/author.dto';
import { Author } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService {
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

  createAuthor(createAuthorDto: AuthorDto) {
    const newAuthor = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(newAuthor);
  }

  updateAuthor(id: string, updateAuthorDto: AuthorDto) {
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
