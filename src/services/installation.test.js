import {parseResultStream} from './installation';
import neo4j from "neo4j-driver"

test('installed', () => {
  const value = {
    count: neo4j.int(3)
  }

  const record = {
    get: jest.fn(key => value[key]),
    has: jest.fn(key => key in value)
  }

  expect(parseResultStream({records: [record]})).toEqual(true)
});

test('not installed', () => {
  const value = {
    count: neo4j.int(0)
  }

  const record = {
    get: jest.fn(key => value[key]),
    has: jest.fn(key => key in value)
  }

  expect(parseResultStream({records: [record]})).toEqual(false)
});
