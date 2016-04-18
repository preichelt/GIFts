import test from 'ava';
import { Gfycat } from './../../server/models/gfycat';
const gfycat = new Gfycat('responseUrl', 'user', 'test');

test('constructor', t => {
  t.plan(1);

  t.deepEqual(gfycat.options, {
    uri: 'https://api.gfycat.com/v1/gfycats/search',
    headers: {
      referer: 'https://www.gfycat.com'
    },
    qs: {
      search_text: 'test',
      count: '100'
    },
    json: true
  });
});

test('parseSearchData', t => {
  t.plan(1);

  t.deepEqual(
    gfycat.parseSearchData([
      { nsfw: '1', gifSize: 1, gifUrl: 'url1' },
      { nsfw: '0', gifSize: 1, gifUrl: 'url2' },
      { nsfw: '0', gifSize: 50000000, gifUrl: 'url3' },
      { nsfw: '0', gifSize: 1, gifUrl: 'url4' }
    ]),
    ['url4', 'url2', 'url2']
  );
});

test('request', t => {
  t.plan(1);

  t.notThrows(gfycat.request());
});
