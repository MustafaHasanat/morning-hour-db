/* eslint-disable prefer-const */
const mergeWithoutDups = (arrays: any[][]) => {
  if (!arrays) return [];

  let newArray = [];

  arrays.map((array) => {
    array.map((item) => {
      if (!newArray.includes(item)) {
        newArray.push(item);
      }
    });
  });

  return newArray;
};

export { mergeWithoutDups };
