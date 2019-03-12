import {filterParameters, baseParameters} from './queries';

test('only keep allowed properties', () => {
  const raw = {mark: [1,2,3], irfan: [4,5,6], michael: 2}
  const allowed = ["irfan", "michael"]
  expect(filterParameters(raw, allowed)).toEqual({irfan: [4,5,6], michael: 2})
});

test('default to outgoing', () => {
  const expected = {
    label: null,
    relationshipType: null,
    limit: 50,
    config: {
      concurrency: null,
      direction: "Outgoing"
    }
  }

  expect(baseParameters()).toEqual(expected)
});

test('limit defaults to 50 if not specified', () => {
  const expected = {
    label: null,
    relationshipType: null,
    limit: 50,
    config: {
      concurrency: null,
      direction: "Outgoing"
    }
  }

  expect(baseParameters(null, null, null, null, 0.3)).toEqual(expected)
});

test('limit cannot be 0', () => {
  const expected = {
    label: null,
    relationshipType: null,
    limit: 50,
    config: {
      concurrency: null,
      direction: "Outgoing"
    }
  }

  expect(baseParameters(null, null, null, null, 0)).toEqual(expected)
});

test('null concurrency if 0 provided', () => {
  const expected = {
    label: null,
    relationshipType: null,
    limit: 50,
    config: {
      concurrency: null,
      direction: "Outgoing"
    }
  }

  expect(baseParameters(null, null, null, 0, null)).toEqual(expected)
});

test('parameters all specified', () => {
  const expected = {
    label: "Label",
    relationshipType: "RelType",
    limit: 20,
    config: {
      concurrency: 8,
      direction: "Both"
    }
  }

  expect(baseParameters("Label", "RelType", "Both", 8, 20)).toEqual(expected)
});

test('direction defaults to outgoing if invalid value provided', () => {
  const expected = {
    label: null,
    relationshipType: null,
    limit: 50,
    config: {
      concurrency: null,
      direction: "Outgoing"
    }
  }

  expect(baseParameters(null, null, "Invalid Direction", null, null)).toEqual(expected)
});
