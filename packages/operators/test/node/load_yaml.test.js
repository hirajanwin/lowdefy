import NodeParser from '../../src/nodeParser';

const state = {};
const args = {};

test('_load_yaml string unquoted', () => {
  const input = { a: { _load_yaml: 'firstName' } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: 'firstName',
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml string quoted', () => {
  const input = { a: { _load_yaml: '"firstName"' } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: 'firstName',
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml number', () => {
  const input = { a: { _load_yaml: '1' } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: 1,
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml boolean true', () => {
  const input = { a: { _load_yaml: 'true' } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: true,
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml boolean false', () => {
  const input = { a: { _load_yaml: 'false' } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: false,
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml null', () => {
  const input = { a: { _load_yaml: 'null' } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: null,
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml undefined string', () => {
  const input = { a: { _load_yaml: 'undefined' } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: undefined,
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml object not allowed', () => {
  const input = { a: { _load_yaml: { b: 'm' } } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: null,
  });
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _load_yaml takes a string as input. Received: {"b":"m"} at locationId.],
    ]
  `);
});

test('_load_yaml date not supported', () => {
  const input = { a: { _load_yaml: new Date(0) } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: null,
  });
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _load_yaml takes a string as input. Received: "1970-01-01T00:00:00.000Z" at locationId.],
    ]
  `);
});

test('_load_yaml array', () => {
  const input = {
    a: {
      _load_yaml: `- a: a1
- a: a2`,
    },
  };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: [{ a: 'a1' }, { a: 'a2' }],
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml date array', () => {
  const input = {
    a: {
      _load_yaml: `- _date: "1970-01-01T00:00:00.000Z"
- _date: "1970-01-01T00:00:00.001Z"`,
    },
  };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: [new Date(0), new Date(1)],
  });
  expect(res.errors).toEqual([]);
});

test('_load_yaml date as object', () => {
  const input = { a: { _load_yaml: `_date: "1970-01-01T00:00:00.000Z"` } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({ a: new Date(0) });
  expect(res.errors).toEqual([]);
});

test('_load_yaml date object', () => {
  const input = {
    a: {
      _load_yaml: `a:
  _date: "1970-01-01T00:00:00.000Z"`,
    },
  };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({ a: { a: new Date(0) } });
  expect(res.errors).toEqual([]);
});

test('_dump_yaml then _load_yaml', () => {
  const value = {
    a: [
      { b: 1, c: false, d: new Date(0) },
      { b: 2, c: true, d: new Date(1) },
    ],
    e: 'null',
    f: 'undefined',
    g: 0,
  };
  const input = { x: { _load_yaml: { _dump_yaml: value } } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({ x: value });
  expect(res.errors).toEqual([]);
});

test('_dump_yaml then _load_yaml date', () => {
  const value = new Date();
  const input = { _load_yaml: { _dump_yaml: value } };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(value);
  expect(res.errors).toEqual([]);
});

test('_load_yaml invalid yaml', () => {
  const input = { _load_yaml: '1: 1: 3' };
  const parser = new NodeParser({ state });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _load_yaml - incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line at line 1, column 5:
        1: 1: 3
            ^ Received: "1: 1: 3" at locationId.],
    ]
  `);
});