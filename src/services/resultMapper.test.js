import {parseProperties} from './resultMapper';

test('arrays', () => {
  const props = {"mark": [1,2,3]}
  expect(parseProperties(props)).toEqual({"mark": "1, 2, 3"})
});

test('numbers', () => {
  const props = {"mark": 99999999999999999999999}
  expect(parseProperties(props)).toEqual({"mark": 99999999999999999999999})
});

test('strings', () => {
  const props = {"mark": "Person"}
  expect(parseProperties(props)).toEqual({"mark": "Person"})
});
