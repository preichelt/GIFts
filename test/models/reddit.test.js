import test from 'ava';
import { Reddit } from './../../server/models/reddit';
const reddit = new Reddit('responseUrl', 'user', 'searchTerm');

test('constructor', t => {
  t.plan(1);

  t.deepEqual(reddit.options, {
    uri: `https://www.reddit.com/r/${reddit.subreddits}/search.json`,
    headers: {
      referer: 'https://www.reddit.com'
    },
    qs: {
      q: 'searchTerm',
      restrict_sr: 'on',
      sort: 'relevance',
      t: 'all'
    },
    json: true
  });
});

test('parseSearchData', t => {
  t.plan(1);

  t.deepEqual(
    reddit.parseSearchData([
      { data: { url: 'http://imgur.com/gallery/JRNw0' } },
      { data: { url: 'http://i.imgur.com/n5iOc72.gif' } },
      { data: { url: 'http://i.imgur.com/M1cuHHF.jpg' } },
      { data: { url: 'http://i.imgur.com/M1cuHHF.png' } },
      { data: { url: 'http://imgur.com/a/uAFvn' } },
      { data: { url: 'http://i.imgur.com/NyV7aK0.gif' } },
      { data: { url: 'http://imgur.com/r/funny' } }
    ]),
    [
      'http://i.imgur.com/NyV7aK0.gif',
      'http://i.imgur.com/n5iOc72.gif',
      'http://i.imgur.com/n5iOc72.gif'
    ]
  );
});

test('request', t => {
  t.plan(1);

  t.notThrows(reddit.request());
});
