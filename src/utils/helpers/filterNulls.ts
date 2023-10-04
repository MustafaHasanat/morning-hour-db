/* eslint-disable prefer-const */
const filterNullsObject = (object: any) => {
  if (!object) return {};

  let newObject = {};

  Object.entries(object).forEach((entry) => {
    const [key, value] = entry;

    if (value) {
      newObject[`${key}`] = value;
    }
  });

  return newObject;
};

const filterNullsArray = (array: any[]) => {
  if (!array) return [];

  const newArray = array.reduce((acc, item) => {
    const newItem = item ? [item] : [];
    return [...acc, ...newItem];
  }, []);

  return newArray;
};

export { filterNullsObject, filterNullsArray };
