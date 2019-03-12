import {parseResultStream} from './installation';
import { v1 as neo } from "neo4j-driver"

test('installed', () => {
  const value = {
    count: neo.int(3)
  }

  const record = {
    get: jest.fn(key => value[key]),
    has: jest.fn(key => key in value)
  }

  expect(parseResultStream({records: [record]})).toEqual(true)
});

test('not installed', () => {
  const value = {
    count: neo.int(0)
  }

  const record = {
    get: jest.fn(key => value[key]),
    has: jest.fn(key => key in value)
  }

  expect(parseResultStream({records: [record]})).toEqual(false)
});
