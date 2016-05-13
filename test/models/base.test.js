import test from 'ava';
import { Base } from './../../server/models/base';
const base = new Base('responseUrl', 'user', 'searchTerm', 'site');

test('constructor', t => {
  t.plan(5);

  t.is(base.slack.responseUrl, 'responseUrl');
  t.is(base.slack.searchTerm,'searchTerm');
  t.is(base.slack.site, 'site');
  t.is(base.user, 'user');
  t.is(base.searchTerm, 'searchTerm');
});

test('reverseFilter', t => {
  t.plan(1);

  t.deepEqual(
    base.reverseFilter([1, 2, 3], n => {
      return n > 1;
    }),
    [3, 2]
  );
});

test('weightedUrl', t => {
  t.plan(3);

  t.deepEqual(base.weightedUrl('url', 0), ['url']);
  t.deepEqual(base.weightedUrl('url', 1), ['url', 'url']);
  t.deepEqual(base.weightedUrl('url', 2), ['url', 'url', 'url']);
});

test('selectRandom', t => {
  t.plan(1);

  t.is(base.selectRandom(['url']), 'url');
});
