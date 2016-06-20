import test from 'ava';
import sinon from 'sinon';
import { Base } from './../../../server/models/base';

test('constructor', t => {
  t.plan(7);

  const base = new Base({
    res: 'responseUrl',
    resType: 'slack',
    user: 'user',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  t.is(base.site, 'site');
  t.is(base.searchTerm, 'searchTerm');
  t.is(base.res, 'responseUrl');
  t.is(base.resType, 'slack');
  t.is(base.slack.responseUrl, 'responseUrl');
  t.is(base.slack.searchTerm,'searchTerm');
  t.is(base.user, 'user');
});

test('reverseFilter', t => {
  t.plan(1);

  const base = new Base({
    res: 'responseUrl',
    resType: 'slack',
    user: 'user',
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
    res: 'responseUrl',
    resType: 'slack',
    user: 'user',
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
    res: 'responseUrl',
    resType: 'slack',
    user: 'user',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  t.is(base.selectRandom(['url']), 'url');
});

test('sendErrorResponse', t => {
  t.plan(1);

  const base = new Base({
    res: 'responseUrl',
    resType: 'slack',
    user: 'user',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  const slackSendErrorResponse = sinon.stub(base.slack, 'sendErrorResponse');

  base.sendErrorResponse();
  t.true(slackSendErrorResponse.called);

  base.slack.sendErrorResponse.restore();
});

test('sendNoUrlsResponse', t => {
  t.plan(1);

  const base = new Base({
    res: 'responseUrl',
    resType: 'slack',
    user: 'user',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  const slackSendNoUrlsResponse = sinon.stub(base.slack, 'sendNoUrlsResponse');

  base.sendNoUrlsResponse();
  t.true(slackSendNoUrlsResponse.called);

  base.slack.sendNoUrlsResponse.restore();
});

test('sendDataResponse', t => {
  t.plan(1);

  const base = new Base({
    res: 'responseUrl',
    resType: 'slack',
    user: 'user',
    searchTerm: 'searchTerm',
    site: 'site'
  });

  const slackSendUrlResponse = sinon.stub(base.slack, 'sendUrlResponse');

  base.sendDataResponse({image_url: 'url'});
  t.true(slackSendUrlResponse.called);

  base.slack.sendUrlResponse.restore();
})
