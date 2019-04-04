import {constructMaps} from './similarity';

test('allDefined', () => {
  const expected = `MATCH (item:\`Foo\`)-[:\`BAR\`]->(category:\`Baz\`)
WITH {item:id(item), categories: collect(id(category))} as userData
WITH collect(userData) as data`

  expect(constructMaps("Foo", "BAR", "Baz")).toEqual(expected)
});

test('noneDefined', () => {
  const expected = `MATCH (item)-->(category)
WITH {item:id(item), categories: collect(id(category))} as userData
WITH collect(userData) as data`

  expect(constructMaps(null, null, null)).toEqual(expected)
});

test('someDefined', () => {
  const expected = `MATCH (item:\`Item\`)-->(category)
WITH {item:id(item), categories: collect(id(category))} as userData
WITH collect(userData) as data`

  expect(constructMaps("Item", null, null)).toEqual(expected)
});