import test from 'ava';
import sinon from 'sinon';
import { Gfycat } from './../../server/models/gfycat';

test('constructor', t => {
  t.plan(1);

  const gfycat = new Gfycat({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'gfycat'
  });

  t.deepEqual(gfycat.options, {
    uri: 'https://api.gfycat.com/v1/gfycats/search',
    headers: {
      referer: 'https://www.gfycat.com'
    },
    qs: {
      search_text: 'searchTerm',
      count: '100'
    },
    json: true
  });
});

test('parseSearchData', t => {
  t.plan(1);

  const gfycat = new Gfycat({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'gfycat'
  });

  t.deepEqual(
    gfycat.parseSearchData([
      { nsfw: '1', gifSize: 1, gifUrl: 'http://gfycat.com/url1' },
      { nsfw: '0', gifSize: 1, gifUrl: 'http://gfycat.com/url2' },
      { nsfw: '0', gifSize: 50000000, gifUrl: 'http://gfycat.com/url3' },
      { nsfw: '0', gifSize: 1, gifUrl: 'http://gfycat.com/url4' }
    ]),
    [
      {
        site: 'gfycat',
        id: 'url4',
        orig_url: 'http://gfycat.com/url4',
        image_url: 'https://giant.gfycat.com/url4.gif',
        iframe_url: 'https://gfycat.com/ifr/url4'
      },
      {
        site: 'gfycat',
        id: 'url2',
        orig_url: 'http://gfycat.com/url2',
        image_url: 'https://giant.gfycat.com/url2.gif',
        iframe_url: 'https://gfycat.com/ifr/url2'
      },
      {
        site: 'gfycat',
        id: 'url2',
        orig_url: 'http://gfycat.com/url2',
        image_url: 'https://giant.gfycat.com/url2.gif',
        iframe_url: 'https://gfycat.com/ifr/url2'
      }
    ]
  );
});

test('request', t => {
  t.plan(1);

  const gfycat = new Gfycat({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'gfycat'
  });

  const rp = sinon.stub(gfycat, 'rp');

  gfycat.request();
  t.true(rp.called);

  gfycat.rp.restore();
});

// NOTE: DOESN'T WORK
test.failing('unsuccessful search', async t => {
  t.plan(2);

  const res = {
    json: sinon.spy()
  };

  const gfycat = new Gfycat({
    res: res,
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'gfycat'
  });

  const p = Promise.reject('error');
  const request = sinon.stub(gfycat, 'request').returns(p);
  const sendErrorResponse = sinon.spy(gfycat, 'sendErrorResponse');

  await gfycat.search();
  t.true(request.called);
  t.true(sendErrorResponse.called);

  gfycat.request.restore();
  gfycat.sendErrorResponse.restore();
});

test('successful search with >0 results', async t => {
  t.plan(3);

  const gfycat = new Gfycat({
    res: {
      json: sinon.spy()
    },
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'gfycat'
  });

  const results = [{ nsfw: '0', gifSize: 1, gifUrl: 'http://gfycat.com/url2' }];
  const p = Promise.resolve(results);
  const request = sinon.stub(gfycat, 'request').returns(p);

  const weightedUrls = [
    {
      site: 'gfycat',
      id: 'url2',
      image_url: 'https://giant.gfycat.com/url2.gif',
      iframe_url: 'https://gfycat.com/ifr/url2'
    }
  ];

  const parseSearchData = sinon.stub(gfycat, 'parseSearchData')
    .returns(weightedUrls);
  const sendDataResponse = sinon.spy(gfycat, 'sendDataResponse');

  await gfycat.search();
  t.true(request.called);
  t.true(parseSearchData.called);
  t.true(sendDataResponse.called);

  gfycat.request.restore();
  gfycat.parseSearchData.restore();
  gfycat.sendDataResponse.restore();
});

test('successful search with 0 results', async t => {
  t.plan(3);

  const gfycat = new Gfycat({
    res: {
      json: sinon.spy()
    },
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'gfycat'
  });

  const results = [];
  const p = Promise.resolve(results);
  const request = sinon.stub(gfycat, 'request').returns(p);
  const weightedUrls = [];
  const parseSearchData = sinon.stub(gfycat, 'parseSearchData')
    .returns(weightedUrls);
  const sendNoUrlsResponse = sinon.spy(gfycat, 'sendNoUrlsResponse');

  await gfycat.search();
  t.true(request.called);
  t.true(parseSearchData.called);
  t.true(sendNoUrlsResponse.called);

  gfycat.request.restore();
  gfycat.parseSearchData.restore();
  gfycat.sendNoUrlsResponse.restore();
});
