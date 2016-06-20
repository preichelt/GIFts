import test from 'ava';
import request from 'supertest-as-promised';
import sinon from 'sinon';
import app from './../../server/index.js';

const postBody = [
  'token=gIkuvaNzQIHg97ATvDxqgjtO',
  'team_id=T0001',
  'team_domain=example',
  'channel_id=C2147483705',
  'channel_name=test',
  'user_id=U2147483697',
  'user_name=Steve',
  'command=/weather',
  'text=test',
].join('&');

test.before(t => {
  sinon.stub(console, 'log');
});

test('POST /api/slack/imgur/gif', t => {
  request(app)
    .post('/api/slack/imgur/gif')
    .send(postBody)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      t.plan(2);

      t.is(
        res.body.text,
        ':mag: searching for *test* gif on imgur :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);

      app.server.close();
    })
    .catch(err => {
      t.fail();

      app.server.close();
    });
});

test('POST /api/slack/imgur/jpg', t => {
  request(app)
    .post('/api/slack/imgur/jpg')
    .send(postBody)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      t.plan(2);

      t.is(
        res.body.text,
        ':mag: searching for *test* jpg on imgur :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);

      app.server.close();
    })
    .catch(err => {
      t.fail();

      app.server.close();
    });
});

test('POST /api/slack/imgur/png', t => {
  request(app)
    .post('/api/slack/imgur/png')
    .send(postBody)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      t.plan(2);

      t.is(
        res.body.text,
        ':mag: searching for *test* png on imgur :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);

      app.server.close();
    })
    .catch(err => {
      t.fail();

      app.server.close();
    });
});

test('POST /api/slack/gfycat/gif', t => {
  request(app)
    .post('/api/slack/gfycat/gif')
    .send(postBody)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      t.plan(2);

      t.is(
        res.body.text,
        ':mag: searching for *test* gif on gfycat :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);

      app.server.close();
    })
    .catch(err => {
      t.fail();

      app.server.close();
    })
});

test('POST /api/slack/reddit/gif', t => {
  request(app)
    .post('/api/slack/reddit/gif')
    .send(postBody)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      t.plan(2);

      t.is(
        res.body.text,
        ':mag: searching for *test* gif on reddit :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);

      app.server.close();
    })
    .catch(err => {
      t.fail();

      app.server.close();
    });
});

test('GET /api/gifs/imgur', t => {
  request(app)
    .get('/api/gifs/imgur?q=test&e=gif')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      t.plan(1);

      t.true(res.body.hasOwnProperty('url'))

      app.server.close();
    })
    .catch(err => {
      t.fail();

      app.server.close();
    });
});

test('GET /api/gifs/reddit', t => {
  request(app)
    .get('/api/gifs/reddit?q=test')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      t.plan(1);

      t.true(res.body.hasOwnProperty('url'))

      app.server.close();
    })
    .catch(err => {
      t.fail();

      app.server.close();
    });
});

test('GET /api/gifs/gfycat', t => {
  request(app)
    .get('/api/gifs/gfycat?q=test')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      t.plan(1);

      t.true(res.body.hasOwnProperty('url'))

      app.server.close();
    })
    .catch(err => {
      t.fail();

      app.server.close();
    });
});
