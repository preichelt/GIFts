import test from 'ava';
import sinon from 'sinon';
import { Base } from './../../../server/models/base';

test('constructor', t => {
  t.plan(4);

  const base = new Base({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  t.is(base.res, 'res');
  t.is(base.resType, 'json');
  t.is(base.searchTerm, 'searchTerm');
  t.is(base.site, 'site');
});

test('reverseFilter', t => {
  t.plan(1);

  const base = new Base({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  t.deepEqual(
    base.reverseFilter([1, 2, 3], n => {
      return n > 1;
    }),
    [3, 2]
  );
});

test('weightedUrl', t => {
  t.plan(3);

  const base = new Base({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  t.deepEqual(base.weightedUrl('url', 0), ['url']);
  t.deepEqual(base.weightedUrl('url', 1), ['url', 'url']);
  t.deepEqual(base.weightedUrl('url', 2), ['url', 'url', 'url']);
});

test('selectRandom', t => {
  t.plan(1);

  const base = new Base({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  t.is(base.selectRandom(['url']), 'url');
});

test('sendErrorResponse', t => {
  t.plan(1);

  const json = sinon.spy();
  const base = new Base({
    res: {
      json: json
    },
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  base.sendErrorResponse();
  t.true(json.called);
});

test('sendNoUrlsResponse', t => {
  t.plan(1);

  const json = sinon.spy();
  const base = new Base({
    res: {
      json: json
    },
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  base.sendNoUrlsResponse();
  t.true(json.called);
});

test('sendDataResponse', t => {
  t.plan(1);

  const json = sinon.spy();
  const base = new Base({
    res: {
      json: json
    },
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  base.sendDataResponse({image_url: 'url'});
  t.true(json.called);
});
