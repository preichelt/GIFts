import rp from 'request-promise';

export class Slack {
  constructor(responseUrl, searchTerm, site) {
    this.responseUrl = responseUrl;
    this.searchTerm = searchTerm;
    this.site = site;
  }

  options(bodyText, responseType = 'ephemeral') {
    return {
      method: 'POST',
      uri: this.responseUrl,
      body: {
        text: bodyText,
        mrkdwn: true,
        response_type: responseType
      },
      json: true
    };
  }

  sendErrorResponse() {
    const bodyText = `:warning: error searching for *${this.searchTerm}* on ${this.site} please try again :warning:`;

    rp(this.options(bodyText)).then(function(results) {
      console.log('successfully responded with ERROR to slack');
    }).catch(function(error) {
      console.log(`failed responding with ERROR to slack: ${error.message}`);
    });
  }

  sendNoUrlsResponse(ext = 'gif') {
    const bodyText = `:zero: ${ext}s found for *${this.searchTerm}* on ${this.site} :thumbsdown:`;

    rp(this.options(bodyText)).then(function(results) {
      console.log('successfully responded with NO URL to slack');
    }).catch(function(error) {
      console.log(`failed responding with NO URL to slack: ${error.message}`);
    });
  }

  sendUrlResponse(url, user) {
    const bodyText = `${user} requested *${this.searchTerm}* \n ${url}`;

    rp(this.options(bodyText, 'in_channel')).then(function(results) {
      console.log(`successfully responded with ${url} to slack`);
    }).catch(function(error) {
      console.log(`failed responding with ${url} to slack: ${error.message}`);
    });
  }
}
