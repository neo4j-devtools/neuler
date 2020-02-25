import {filterParameters, baseParameters, centralityParams} from './queries';

test('only keep allowed properties', () => {
  const raw = {mark: [1,2,3], irfan: [4,5,6], michael: 2}
  const allowed = ["irfan", "michael"]
  expect(filterParameters(raw, allowed)).toEqual({irfan: [4,5,6], michael: 2})
});

// test('default to outgoing', () => {
//   const expected = {
//     label: null,
//     relationshipType: null,
//     limit: 50,
//     config: {
//       concurrency: null,
//       direction: "Outgoing"
//     }
//   }
//
//   expect(baseParameters()).toEqual(expected)
// });
//
// test('limit defaults to 50 if not specified', () => {
//   const expected = {
//     label: null,
//     relationshipType: null,
//     limit: 50,
//     config: {
//       concurrency: null,
//       direction: "Outgoing"
//     }
//   }
//
//   expect(baseParameters(null, null, null, null, 0.3)).toEqual(expected)
// });
//
// test('limit cannot be 0', () => {
//   const expected = {
//     label: null,
//     relationshipType: null,
//     limit: 50,
//     config: {
//       concurrency: null,
//       direction: "Outgoing"
//     }
//   }
//
//   expect(baseParameters(null, null, null, null, 0)).toEqual(expected)
// });
//
// test('null concurrency if 0 provided', () => {
//   const expected = {
//     label: null,
//     relationshipType: null,
//     limit: 50,
//     config: {
//       concurrency: null,
//       direction: "Outgoing"
//     }
//   }
//
//   expect(baseParameters(null, null, null, 0, null)).toEqual(expected)
// });
//
// test('parameters all specified', () => {
//   const expected = {
//     label: "Label",
//     relationshipType: "RelType",
//     limit: 20,
//     config: {
//       concurrency: 8,
//       direction: "Both"
//     }
//   }
//
//   expect(baseParameters("Label", "RelType", "Both", 8, 20)).toEqual(expected)
// });
//
// test('direction defaults to outgoing if invalid value provided', () => {
//   const expected = {
//     label: null,
//     relationshipType: null,
//     limit: 50,
//     config: {
//       concurrency: null,
//       direction: "Outgoing"
//     }
//   }
//
//   expect(baseParameters(null, null, "Invalid Direction", null, null)).toEqual(expected)
// });
//
// test('probability defaults to null if invalid', () => {
//   const params = centralityParams({requiredProperties:["probability"], probability: -0.1})
//   expect(params.config).toEqual({probability: null})
// });
//
// test('probability passed through if positive', () => {
//   const params = centralityParams({requiredProperties:["probability"], probability: 0.7})
//   expect(params.config).toEqual({probability: 0.7})
// });
//
// test('maxDepth defaults to null if invalid', () => {
//   const params = centralityParams({requiredProperties:["maxDepth"], maxDepth: -1})
//   expect(params.config).toEqual({maxDepth: null})
// });
//
// test('maxDepth passed through if positive', () => {
//   const params = centralityParams({requiredProperties:["maxDepth"], maxDepth: 7})
//   expect(params.config).toEqual({maxDepth: 7})
// });
//
// test('default weight defaults to null if invalid', () => {
//   const params = centralityParams({requiredProperties:["defaultValue"], defaultValue: ""})
//   expect(params.config).toEqual({defaultValue: null})
// });
//
// test('damping factor defaults to null if invalid', () => {
//   const params = centralityParams({requiredProperties:["dampingFactor"], dampingFactor: ""})
//   expect(params.config).toEqual({dampingFactor: null})
// });
//
// test('iterations must be > 0', () => {
//   const params = centralityParams({requiredProperties:["iterations"], iterations: -1})
//   expect(params.config).toEqual({iterations: null})
// });
//
// test('empty writeProperty defaults to null', () => {
//   const params = centralityParams({requiredProperties:["writeProperty"], writeProperty: ""})
//   expect(params.config).toEqual({writeProperty: null})
// });
//
// test('empty weightProperty defaults to null', () => {
//   const params = centralityParams({requiredProperties:["weightProperty"], weightProperty: ""})
//   expect(params.config).toEqual({nodeProjection: null, relationshipProjection: null, weightProperty: null})
// });
test('nodeProjection always required', () => {
  const params = centralityParams({requiredProperties:[], label: "Foo"})
  expect(params.config).toEqual({nodeProjection: "Foo", relationshipProjection: null})
});

test('relationshipProjection defaults to NATURAL', () => {
  const params = centralityParams({requiredProperties:[], label: "Foo", relationshipType: "BAR"})
  expect(params.config).toEqual({nodeProjection: "Foo", relationshipProjection: {BAR: {type: "BAR", projection: "NATURAL"}}})
});

test('relationshipProjection uses direction', () => {
  const params = centralityParams({requiredProperties:[], label: "Foo", relationshipType: "BAR", direction: "Reverse"})
  expect(params.config).toEqual({nodeProjection: "Foo", relationshipProjection: {BAR: {type: "BAR", projection: "REVERSE"}}})
});
