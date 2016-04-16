import { Slack } from './slack';
import _replace from 'lodash/replace';
import _filter from 'lodash/filter';
import _reverse from 'lodash/reverse';
import _times from 'lodash/times';
import _random from 'lodash/random';

export class Base {
  constructor(responseUrl, user, searchTerm, site) {
    this.slack = new Slack(responseUrl, searchTerm, site);
    this.user = user;
    this.searchTerm = _replace(searchTerm, '\'', '');
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
}
