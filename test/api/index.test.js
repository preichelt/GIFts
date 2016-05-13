import test from 'ava';
import request from 'supertest';
import app from './../../server/index.js';

const body = [
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

test('POST /api/images/imgur/gif', t => {
  request(app)
    .post('/api/images/imgur/gif')
    .send(body)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.plan(3);

      t.ifError(err);

      t.is(
        res.body.text,
        ':mag: searching for *test* gif on imgur :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);
      app.server.close();
    });
});

test('POST /api/images/imgur/jpg', t => {
  request(app)
    .post('/api/images/imgur/jpg')
    .send(body)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.plan(3);

      t.ifError(err);

      t.is(
        res.body.text,
        ':mag: searching for *test* jpg on imgur :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);
      app.server.close();
    });
});

test('POST /api/images/imgur/png', t => {
  request(app)
    .post('/api/images/imgur/png')
    .send(body)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.plan(3);

      t.ifError(err);

      t.is(
        res.body.text,
        ':mag: searching for *test* png on imgur :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);
      app.server.close();
    });
});

test('POST /api/images/gfycat/gif', t => {
  request(app)
    .post('/api/images/gfycat/gif')
    .send(body)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.plan(3);

      t.ifError(err);

      t.is(
        res.body.text,
        ':mag: searching for *test* gif on gfycat :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);
      app.server.close();
    });
});

test('POST /api/images/reddit/gif', t => {
  request(app)
    .post('/api/images/reddit/gif')
    .send(body)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.plan(3);

      t.ifError(err);

      t.is(
        res.body.text,
        ':mag: searching for *test* gif on reddit :hourglass_flowing_sand:'
      );

      t.is(res.body.mrkdwn, true);
      app.server.close();
    });
});
