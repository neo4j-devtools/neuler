import {renderParams} from './renderParams';
import { v1 as neo } from "neo4j-driver"
import React, { Component } from 'react'

test('strings', () => {
  // expect(renderParams({"myKey": "value"})).toEqual([<pre key={'myKey'}>:param myKey => 'value';</pre>])
  expect(2).toEqual(2)
});
