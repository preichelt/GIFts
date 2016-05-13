import test from 'ava';
import { Imgur } from './../../server/models/imgur';
const imgur = new Imgur('responseUrl', 'user', 'test', 'gif');

test('constructor', t => {
  t.plan(1);

  t.is(imgur.ext, 'gif');
});

test('options', t => {
  t.plan(1);

  t.deepEqual(imgur.options('all', 1), {
    method: 'POST',
    uri: 'http://imgur.com/search/score/all/page/1.json?q_type=gif&q_all=test',
    headers: {
      referer: 'http://imgur.com'
    },
    json: true
  });
});

test('parseSearchData', t => {
  t.plan(1);

  t.deepEqual(
    imgur.parseSearchData([
      { nsfw: true, size: 1, hash: 'hash1' },
      { nsfw: false, size: 1, hash: 'hash2' },
      { nsfw: false, size: 50000000, hash: 'hash3' },
      { nsfw: false, size: 1, hash: 'hash4' }
    ]),
    [
      'http://i.imgur.com/hash4.gif',
      'http://i.imgur.com/hash2.gif',
      'http://i.imgur.com/hash2.gif'
    ]
  );
});

test('request', t => {
  t.plan(1);

  t.notThrows(imgur.request());
});
