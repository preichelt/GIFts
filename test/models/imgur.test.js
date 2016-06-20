import test from 'ava';
import sinon from 'sinon';
import { Imgur } from './../../server/models/imgur';

test('constructor', t => {
  t.plan(1);

  const imgur = new Imgur({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'imgur',
    ext: 'gif'
  });

  t.is(imgur.ext, 'gif');
});

test('options', t => {
  t.plan(1);

  const imgur = new Imgur({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'imgur',
    ext: 'gif'
  });

  t.deepEqual(imgur.options('all', 1), {
    method: 'POST',
    uri: 'http://imgur.com/search/score/all/page/1.json?q_type=gif&q_all=searchTerm',
    headers: {
      referer: 'http://imgur.com'
    },
    json: true
  });
});

test('parseSearchData', t => {
  t.plan(1);

  const imgur = new Imgur({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'imgur',
    ext: 'gif'
  });

  t.deepEqual(
    imgur.parseSearchData([
      { nsfw: true, size: 1, hash: 'hash1' },
      { nsfw: false, size: 1, hash: 'hash2' },
      { nsfw: false, size: 50000000, hash: 'hash3' },
      { nsfw: false, size: 1, hash: 'hash4' }
    ]),
    [
      {
        site: 'imgur',
        id: 'hash4',
        image_url: 'http://i.imgur.com/hash4.gif'
      },
      {
        site: 'imgur',
        id: 'hash2',
        image_url: 'http://i.imgur.com/hash2.gif'
      },
      {
        site: 'imgur',
        id: 'hash2',
        image_url: 'http://i.imgur.com/hash2.gif'
      }
    ]
  );
});

test('request', t => {
  t.plan(1);

  const imgur = new Imgur({
    res: 'res',
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'imgur',
    ext: 'gif'
  });

  const rp = sinon.stub(imgur, 'rp');

  imgur.request();
  t.true(rp.called);

  imgur.rp.restore();
});

// NOTE: DOESN'T WORK
test.failing('successful search with >0 results', async t => {
  t.plan(3);

  const res = {
    json: sinon.spy()
  };

  const imgur = new Imgur({
    res: res,
    resType: 'json',
    searchTerm: 'searchTerm',
    site: 'imgur',
    ext: 'gif'
  });

  const results = { data: [ { nsfw: false, size: 1, hash: 'hash2' } ] };
  const p = Promise.resolve(results);
  const pall = Promise.all([p, p, p, p, p]);
  const request = sinon.stub(imgur, 'request').returns(pall);

  const weightedUrls = [
    {
      site: 'imgur',
      id: 'hash2',
      image_url: 'http://i.imgur.com/hash2.gif'
    }
  ];

  const parseSearchData = sinon.stub(imgur, 'parseSearchData')
    .returns(weightedUrls);
  const sendDataResponse = sinon.spy(imgur, 'sendDataResponse');

  await imgur.search();
  t.true(request.called);
  t.true(parseSearchData.called);
  t.true(sendDataResponse.called);

  imgur.request.restore();
  imgur.parseSearchData.restore();
  imgur.sendDataResponse.restore();
});
