import { Author } from 'src/schemas/authors/entities/author.entity';
import { Category } from 'src/schemas/categories/entities/category.entity';
import { Item } from 'src/schemas/items/entities/item.entity';
import { Notification } from 'src/schemas/notification/entities/notification.entity';
import { Order } from 'src/schemas/orders/entities/order.entity';
import { Review } from 'src/schemas/reviews/entities/review.entity';
import { User } from 'src/schemas/users/entities/user.entity';

const entities = [Author, Category, Item, User, Review, Order, Notification];

export default entities;
