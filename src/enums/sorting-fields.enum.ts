enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

enum FilterOperator {
  CONTAINS = 'contains',
  MORE = 'moreThan',
  MORE_EQ = 'moreThanOrEqual',
  LESS = 'lessThan',
  LESS_EQ = 'lessThanOrEqual',
  EQUALS = 'equals',
}

// -------------------------

enum AuthorFields {
  NAME = 'name',
  BRIEF = 'brief',
}

enum CategoryFields {
  TITLE = 'title',
}

enum ItemFields {
  TITLE = 'title',
  DESCRIPTION = 'description',
  CURRENT_PRICE = 'currentPrice',
  OLD_PRICE = 'oldPrice',
  PRIMARY_COLOR = 'primaryColor',
}

enum OrderFields {
  CREATED_AT = 'createdAt',
}

enum ReviewFields {
  TEXT = 'text',
  RATING = 'rating',
}

enum UserFields {
  USERNAME = 'userName',
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  GENDER = 'gender',
  ROLE = 'role',
  ADDRESS = 'address',
}

// -------------------------

export {
  SortDirection,
  FilterOperator,
  AuthorFields,
  CategoryFields,
  ItemFields,
  OrderFields,
  ReviewFields,
  UserFields,
};
