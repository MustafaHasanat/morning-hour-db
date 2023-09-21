import { Author } from 'src/schemas/authors/entities/author.entity';
import { Category } from 'src/schemas/categories/entities/category.entity';
import { Item } from 'src/schemas/items/entities/item.entity';
import { Order } from 'src/schemas/orders/entities/order.entity';
import { Review } from 'src/schemas/reviews/entities/review.entity';
import { UserType } from 'src/schemas/user-type/entities/user-type.entity';
import { User } from 'src/schemas/users/entities/user.entity';

const entities = [Author, Category, Item, User, Review, Order, UserType];

export default entities;
