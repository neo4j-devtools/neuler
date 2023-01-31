import {parseProperties} from './resultMapper';
import neo4j from "neo4j-driver"

test('arrays', () => {
  const props = {"mark": [1,2,3]}
  expect(parseProperties(props)).toEqual({"mark": "1, 2, 3"})
});

test('numbers', () => {
  const value = 999
  const props = {"mark": neo4j.int(value)}
  expect(parseProperties(props)).toEqual({"mark": value})
});

test('strings', () => {
  const props = {"mark": "Person"}
  expect(parseProperties(props)).toEqual({"mark": "Person"})
});
