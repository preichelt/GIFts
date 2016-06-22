import rp from 'request-promise';

export class Slack {
  constructor(responseUrl, searchTerm) {
    this.responseUrl = responseUrl;
    this.searchTerm = searchTerm;
    this.rp = rp;
  }

  options(bodyText, responseType = 'ephemeral') {
    return {
      method: 'POST',
      uri: this.responseUrl,
      body: {
        text: bodyText,
        unfurl_links: true,
        mrkdwn: true,
        response_type: responseType
      },
      json: true
    };
  }

  sendResponse(bodyText, responseType = 'ephemeral') {
    return this.rp(this.options(bodyText, responseType));
  }

  sendErrorResponse(bodyText) {
    this.sendResponse(bodyText)
      .then(results => {
        console.log('successfully responded with ERROR to slack');
      })
      .catch(error => {
        console.log(`failed responding with ERROR to slack: ${error.message}`);
      });
  }

  sendNoUrlsResponse(bodyText) {
    this.sendResponse(bodyText)
      .then(results => {
        console.log('successfully responded with NO URL to slack');
      })
      .catch(error => {
        console.log(`failed responding with NO URL to slack: ${error.message}`);
      });
  }

  sendUrlResponse(url, user) {
    const bodyText = `${user} requested <${url}|${this.searchTerm}>`;

    this.sendResponse(bodyText, 'in_channel')
      .then(results => {
        console.log(`successfully responded with ${url} to slack`);
      })
      .catch(error => {
        console.log(`failed responding with ${url} to slack: ${error.message}`);
      });
  }
}
