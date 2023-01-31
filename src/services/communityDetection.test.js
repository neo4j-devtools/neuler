import {parseResultStream} from './communityDetection';
import neo4j from "neo4j-driver"

test('no result', () => {
  function invalidResult() {
    parseResultStream({error: "Went HAM"})
  }

  expect(invalidResult).toThrowError("HAM")
});

test('single community', () => {
  const labels = ["Person"]
  const properties = {"name": "Mark"}
  const identity = 5
  const size = 3
  const community = 2

  const value = {
    nodes: [{
      properties: properties,
      labels: labels,
      identity: {
        toNumber: jest.fn(() => identity)
      }
    }],
    community: neo4j.int(community),
    size: {
      toNumber: jest.fn(() => size)
    }
  }

  const record = {
    get: jest.fn(key => value[key]),
    has: jest.fn(key => key in value)
  }

  const expected = {
    ids: [identity],
    labels: labels,
    rows: [{
      community: community,
      communities: null,
      nodes:[{
        identity: identity,
        labels:labels,
        properties:properties,
      }],
      size:size
  }]
  }

  expect(parseResultStream({records: [record]})).toEqual(expected)
});

test('multiple communities', () => {
  const labels = ["Person"]
  const properties = {"name": "Mark"}
  const identity = 5
  const size = 3
  const community = 2
  const communities = "1,2,3"

  const value = {
    nodes: [{
      properties: properties,
      labels: labels,
      identity: {
        toNumber: jest.fn(() => identity)
      }
    }],
    community: neo4j.int(community),
    communities: [neo4j.int(1), neo4j.int(2), neo4j.int(3)],
    size: {
      toNumber: jest.fn(() => size)
    }
  }

  const record = {
    get: jest.fn(key => value[key]),
    has: jest.fn(key => key in value)
  }

  const expected = {
    ids: [identity],
    labels: labels,
    rows: [{
      community: community,
      communities: communities,
      nodes:[{
        identity: identity,
        labels:labels,
        properties:properties,
      }],
      size:size
  }]
}

  expect(parseResultStream({records: [record]})).toEqual(expected)
});
