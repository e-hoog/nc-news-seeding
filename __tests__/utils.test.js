const {
  convertTimestampToDate,
  createLookupObject
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe('createLookupObject', () => {
  test('returns a new object', () => {
    const rowInput = [{
      key : "test",
      value: "passed"
    }]
    const keyInput = "key"
    const valueInput = "value"
    const result = createLookupObject(rowInput, keyInput, valueInput)
    expect(result).toBeObject()
  });
  test('creates a lookup object with 1 correct key value pair if given a single object in the database', () => {
    const rowInput = [{
      key : "test",
      value: "passed",
    }]
    const keyInput = "key"
    const valueInput = "value"
    const result = createLookupObject(rowInput, keyInput, valueInput)
    const expected = {test: "passed"}
    expect(result).toEqual(expected)
  })
  test('creates a lookup object with multiple correct key value pairs if given multiple objects in the database', () => {
    const rowInput = [{
      key : "test",
      value: "passed",
    },
    {
      key : "multiple test",
      value: "passed",
    }
  ]
    const keyInput = "key"
    const valueInput = "value"
    const result = createLookupObject(rowInput, keyInput, valueInput)
    const expected = {test: "passed", "multiple test" : "passed"}
    expect(result).toEqual(expected)
  });
  test('ignores all other key value pairs in the database', () => {
    const rowInput = [{
      key : "test",
      value: "passed",
      wrongKey: "wrongValue"
    },
    {
      key : "multiple test",
      value: "passed",
      wrongKey: "wrongValue2"
    }
  ]
    const keyInput = "key"
    const valueInput = "value"
    const result = createLookupObject(rowInput, keyInput, valueInput)
    const expected = {test: "passed", "multiple test" : "passed"}
    expect(result).toEqual(expected)
  });
  test('does not mutate the input', () => {
    const rowInput = [{
      key : "test",
      value: "passed",
    }]
    const keyInput = "key"
    const valueInput = "value"
    createLookupObject(rowInput, keyInput, valueInput)
    const control = [{
      key : "test",
      value: "passed",
    }]
    expect(rowInput).toEqual(control)
  })
  test('returns empty object if given a database without correct key value pairs', () => {
    const rowInput = [{
      key1 : "value1",
      key2 : "value2",
    }]
    const keyInput = "otherKey"
    const valueInput = "otherValue"
    const result = createLookupObject(rowInput, keyInput, valueInput)
    expect(result).toEqual({})
  });
});