export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 1, b = 0, dec = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return Number((lower + Math.random() * (upper - lower)).toFixed(dec));
};

export const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

export const getRandomArray = (array) => {
  const newArray = array.filter(() => Math.random() > 0.5);
  newArray.length ? newArray : newArray.push(array[getRandomInteger(0, array.length - 1)]);
  return newArray;
};
