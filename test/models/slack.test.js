import test from 'ava';
import { Slack } from './../../server/models/slack';
const slack = new Slack('responseUrl', 'searchTerm', 'site');

test('constructor', t => {
  t.plan(3);

  t.is(slack.responseUrl, 'responseUrl');
  t.is(slack.searchTerm, 'searchTerm');
  t.is(slack.site, 'site');
});

test('options', t => {
  t.plan(2);

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
