const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  test("return an array with the same length as input array", () => {
    const inputArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffle(inputArray);
    expect(shuffledArray).toHaveLength(inputArray.length);
  });

  test("contain the same elements as input array", () => {
    const inputArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffle(inputArray);
    inputArray.forEach((element) => {
      expect(shuffledArray).toContain(element);
    });
  });

  test("not modify the input array", () => {
    const inputArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffle(inputArray);
    expect(shuffledArray).not.toBe(inputArray);
  });
});