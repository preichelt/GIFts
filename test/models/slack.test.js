import test from 'ava';
import sinon from 'sinon';
import { Slack } from './../../server/models/slack';

test.before(t => {
  sinon.stub(console, 'log');
});

test.after.always('guaranteed cleanup', t => {
  console.log.restore();
});

test('constructor', t => {
  t.plan(2);

  const slack = new Slack('responseUrl', 'searchTerm');

  t.is(slack.responseUrl, 'responseUrl');
  t.is(slack.searchTerm, 'searchTerm');
});

test('options', t => {
  t.plan(2);

  const slack = new Slack('responseUrl', 'searchTerm');

  t.deepEqual(slack.options('bodyText'), {
    method: 'POST',
    uri: 'responseUrl',
    body: {
      text: 'bodyText',
      unfurl_links: true,
      mrkdwn: true,
      response_type: 'ephemeral'
    },
    json: true
  });

  t.deepEqual(slack.options('bodyText', 'in_channel'), {
    method: 'POST',
    uri: 'responseUrl',
    body: {
      text: 'bodyText',
      unfurl_links: true,
      mrkdwn: true,
      response_type: 'in_channel'
    },
    json: true
  });
});

test('sendResponse', t => {
  t.plan(1);

  const slack = new Slack('responseUrl', 'searchTerm');
  const rp = sinon.stub(slack, 'rp');

  slack.sendResponse('bodyText');
  t.true(rp.called);

  slack.rp.restore();
});

test('sendErrorResponse', async t => {
  t.plan(2);

  const slack = new Slack('responseUrl', 'searchTerm');
  const p = Promise.resolve('success');
  const sendResponse = sinon.stub(slack, 'sendResponse').returns(p);

  await slack.sendErrorResponse('bodyText');
  t.true(sendResponse.called);
  t.true(console.log.called);

  slack.sendResponse.restore();
});

test('sendNoUrlsResponse', async t => {
  t.plan(2);

  const slack = new Slack('responseUrl', 'searchTerm');
  const p = Promise.resolve('success');
  const sendResponse = sinon.stub(slack, 'sendResponse').returns(p);

  await slack.sendNoUrlsResponse('bodyText');
  t.true(sendResponse.called);
  t.true(console.log.called);

  slack.sendResponse.restore();
});

test('sendUrlResponse', async t => {
  t.plan(2);

  const slack = new Slack('responseUrl', 'searchTerm');
  const p = Promise.resolve('success');
  const sendResponse = sinon.stub(slack, 'sendResponse').returns(p);

  await slack.sendUrlResponse('bodyText');
  t.true(sendResponse.called);
  t.true(console.log.called);

  slack.sendResponse.restore();
});
