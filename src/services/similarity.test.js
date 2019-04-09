import {constructSimilarityMaps, constructWeightedSimilarityMaps} from './similarity';

test('allDefined', () => {
  const expected = `MATCH (item:\`Foo\`)-[:\`BAR\`]->(category:\`Baz\`)
WITH {item:id(item), categories: collect(distinct id(category))} as userData
WITH collect(userData) as data`

  expect(constructSimilarityMaps("Foo", "BAR", "Baz")).toEqual(expected)
});

test('noneDefined', () => {
  const expected = `MATCH (item)-->(category)
WITH {item:id(item), categories: collect(distinct id(category))} as userData
WITH collect(userData) as data`

  expect(constructSimilarityMaps(null, null, null)).toEqual(expected)
});

test('someDefined', () => {
  const expected = `MATCH (item:\`Item\`)-->(category)
WITH {item:id(item), categories: collect(distinct id(category))} as userData
WITH collect(userData) as data`

  expect(constructSimilarityMaps("Item", null, null)).toEqual(expected)
});


test('weightedAllDefined', () => {
  const expected = `MATCH (item:\`Foo\`), (category:\`Baz\`)
OPTIONAL MATCH (item:\`Foo\`)-[rel:\`BAR\`]->(category:\`Baz\`)
WITH {item:id(item), weights: collect(coalesce(rel[$weightProperty], algo.NaN()))} as userData
WITH collect(userData) as data`

  expect(constructWeightedSimilarityMaps("Foo", "BAR", "Baz")).toEqual(expected)
});


test('weightedNoneDefined', () => {
  const expected = `MATCH (item), (category)
OPTIONAL MATCH (item)-[rel]->(category)
WITH {item:id(item), weights: collect(coalesce(rel[$weightProperty], algo.NaN()))} as userData
WITH collect(userData) as data`

  expect(constructWeightedSimilarityMaps(null, null, null)).toEqual(expected)
});

test('weightedSomeDefined', () => {
  const expected = `MATCH (item:\`Item\`), (category)
OPTIONAL MATCH (item:\`Item\`)-[rel]->(category)
WITH {item:id(item), weights: collect(coalesce(rel[$weightProperty], algo.NaN()))} as userData
WITH collect(userData) as data`

  expect(constructWeightedSimilarityMaps("Item", null, null)).toEqual(expected)
});