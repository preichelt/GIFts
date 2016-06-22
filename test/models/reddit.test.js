import test from 'ava';
import sinon from 'sinon';
import { Reddit } from './../../server/models/reddit';

test('constructor', t => {
  t.plan(1);

  const reddit = new Reddit({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'reddit'
  });

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

  const reddit = new Reddit({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'reddit'
  });

  t.deepEqual(
    reddit.parseSearchData([
      { data: { url: 'http://imgur.com/gallery/JRNw0' } },
      { data: { url: 'http://i.imgur.com/n5iOc72.gif' } },
      { data: { url: 'http://i.imgur.com/M1cuHHF.jpg' } },
      { data: { url: 'http://i.imgur.com/M1cuHHF.png' } },
      { data: { url: 'http://imgur.com/a/uAFvn' } },
      { data: { url: 'http://i.imgur.com/NyV7aK0.gif' } },
      { data: { url: 'http://imgur.com/r/funny' } },
      { data: { url: 'https://gfycat.com/AncientBitesizedElephantseal' } }
    ]),
    [
      {
        site: 'gfycat',
        id: 'AncientBitesizedElephantseal',
        orig_url: 'https://gfycat.com/AncientBitesizedElephantseal',
        image_url: 'https://giant.gfycat.com/AncientBitesizedElephantseal.gif',
        iframe_url: 'https://gfycat.com/ifr/AncientBitesizedElephantseal'
      },
      {
        site: 'imgur',
        id: 'NyV7aK0',
        orig_url: 'http://i.imgur.com/NyV7aK0.gif',
        image_url: 'http://i.imgur.com/NyV7aK0.gif'
      },
      {
        site: 'imgur',
        id: 'NyV7aK0',
        orig_url: 'http://i.imgur.com/NyV7aK0.gif',
        image_url: 'http://i.imgur.com/NyV7aK0.gif'
      },
      {
        site: 'imgur',
        id: 'n5iOc72',
        orig_url: 'http://i.imgur.com/n5iOc72.gif',
        image_url: 'http://i.imgur.com/n5iOc72.gif'
      },
      {
        site: 'imgur',
        id: 'n5iOc72',
        orig_url: 'http://i.imgur.com/n5iOc72.gif',
        image_url: 'http://i.imgur.com/n5iOc72.gif'
      },
      {
        site: 'imgur',
        id: 'n5iOc72',
        orig_url: 'http://i.imgur.com/n5iOc72.gif',
        image_url: 'http://i.imgur.com/n5iOc72.gif'
      }
    ]
  );
});

test('request', t => {
  t.plan(1);

  const reddit = new Reddit({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'reddit'
  });

  const rp = sinon.stub(reddit, 'rp');

  reddit.request();
  t.true(rp.called);

  reddit.rp.restore();
});

// NOTE: DOESN'T WORK
test.failing('unsuccessful search', async t => {
  t.plan(2);

  const res = {
    json: sinon.spy()
  };

  const reddit = new Reddit({
    res: res,
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'reddit'
  });

  const p = Promise.reject('error');
  const request = sinon.stub(reddit, 'request').returns(p);
  const sendErrorResponse = sinon.spy(reddit, 'sendErrorResponse');

  await reddit.search();
  t.true(request.called);
  t.true(sendErrorResponse.called);

  reddit.request.request();
  reddit.sendErrorResponse.restore();
});

test('successful search with >0 results', async t => {
  t.plan(3);

  const res = {
    json: sinon.spy()
  };

  const reddit = new Reddit({
    res: res,
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'reddit'
  });

  const results = {
    data: { children: [ { data: { url: 'http://i.imgur.com/n5iOc72.gif' } } ] }
  };

  const p = Promise.resolve(results);
  const request = sinon.stub(reddit, 'request').returns(p);

  const weightedUrls = [
    {
      site: 'imgur',
      id: 'n5iOc72',
      image_url: 'http://i.imgur.com/n5iOc72.gif'
    }
  ];

  const parseSearchData = sinon.stub(reddit, 'parseSearchData')
    .returns(weightedUrls);
  const sendDataResponse = sinon.spy(reddit, 'sendDataResponse');

  await reddit.search();
  t.true(request.called);
  t.true(parseSearchData.called);
  t.true(sendDataResponse.called);

  reddit.request.restore();
  reddit.parseSearchData.restore();
  reddit.sendDataResponse.restore();
});

test('successful search with 0 results', async t => {
  t.plan(3);

  const res = {
    json: sinon.spy()
  };

  const reddit = new Reddit({
    res: res,
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'reddit'
  });

  const results = { data: { children: [] } };
  const p = Promise.resolve(results);
  const request = sinon.stub(reddit, 'request').returns(p);
  const weightedUrls = [];
  const parseSearchData = sinon.stub(reddit, 'parseSearchData')
    .returns(weightedUrls);
  const sendNoUrlsResponse = sinon.spy(reddit, 'sendNoUrlsResponse');

  await reddit.search();
  t.true(request.called);
  t.true(parseSearchData.called);
  t.true(sendNoUrlsResponse.called);

  reddit.request.restore();
  reddit.parseSearchData.restore();
  reddit.sendNoUrlsResponse.restore();
});
