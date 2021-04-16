export const getRandomFloat = (a = 0, b = 1, dec = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return Number((lower + Math.random() * (upper - lower)).toFixed(dec));
};

export const getRandomInteger = (a = 0, b = 1) => {
  return getRandomFloat(a, b, 0);
};

export const getRandomArrayElement = (data) => data[getRandomInteger(0, data.length - 1)];

export const getRandomArray = (data) => {
  const newData = data.filter(() => Math.random() > 0.5);
  newData.length ? newData : newData.push(data[getRandomInteger(0, data.length - 1)]);
  return newData;
};
