import { Slack } from './slack';
import _replace from 'lodash/replace';
import _filter from 'lodash/filter';
import _reverse from 'lodash/reverse';
import _times from 'lodash/times';
import _random from 'lodash/random';

export class Base {
  constructor(opts) {
    this.site = opts.site;
    this.searchTerm = _replace(opts.searchTerm, '\'', '');
    this.res = opts.res;
    this.resType = opts.resType;
    if(this.resType == 'slack') {
      this.slack = new Slack(this.res, this.searchTerm);
      this.user = opts.user;
    }
  }

  reverseFilter(data, callback) {
    return _reverse(_filter(data, callback));
  }

  weightedUrl(url, index) {
    return _times(index + 1, i => url);
  }

  selectRandom(urls) {
    return urls[_random(0, urls.length - 1)];
  }

  sendErrorResponse() {
    const error = `:warning: error searching for *${
      this.searchTerm
    }* on ${this.site} please try again :warning:`;

    if(this.resType == 'slack') {
      this.slack.sendErrorResponse(error);
    } else {
      this.res.json({error: error})
    }
  }

  sendNoUrlsResponse(ext = 'gif') {
    const error = `:zero: ${ext}s found for *${
      this.searchTerm
    }* on ${this.site} :thumbsdown:`;

    if(this.resType == 'slack') {
      this.slack.sendNoUrlsResponse(error);
    } else {
      this.res.json({error: error});
    }
  }

  sendDataResponse(data) {
    if(this.resType == 'slack') {
      this.slack.sendUrlResponse(data.image_url, this.user);
    } else {
      this.res.json(data);
    }
  }
}
