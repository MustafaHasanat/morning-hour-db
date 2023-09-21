/* eslint-disable prefer-const */
const filterNulls = (object: any) => {
  let newObject = {};

  Object.entries(object).forEach((entry) => {
    const [key, value] = entry;

    if (value) {
      newObject[`${key}`] = value;
    }
  });

  return newObject;
};

export default filterNulls;
