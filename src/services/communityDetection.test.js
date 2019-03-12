import {parseResultStream} from './communityDetection';
import { v1 as neo } from "neo4j-driver"

test('no result', () => {
  function invalidResult() {
    parseResultStream({error: "Went HAM"})
  }

  expect(invalidResult).toThrowError("HAM")
});

test('single community', () => {
  const labels = ["Person"]
  const properties = {"name": "Mark"}
  const community = 2

  const value = {
    node: {
      properties: properties,
      labels: labels
    },
    community: neo.int(community)
  }

  const record = {
    get: jest.fn(key => value[key]),
    has: jest.fn(key => key in value)
  }

  const expected = [{
    properties: properties,
    labels: labels,
    community: community,
    communities: null
  }]

  expect(parseResultStream({records: [record]})).toEqual(expected)
});

test('mutliple communities', () => {
  const labels = ["Person"]
  const properties = {"name": "Mark"}
  const community = 2
  const communities = "1,2,3"

  const value = {
    node: {
      properties: properties,
      labels: labels
    },
    community: neo.int(community),
    communities: [neo.int(1), neo.int(2), neo.int(3)]
  }

  const record = {
    get: jest.fn(key => value[key]),
    has: jest.fn(key => key in value)
  }

  const expected = [{
    properties: properties,
    labels: labels,
    community: community,
    communities: communities
  }]

  expect(parseResultStream({records: [record]})).toEqual(expected)
});
