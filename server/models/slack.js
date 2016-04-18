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
        unfurl_links: true,
        mrkdwn: true,
        response_type: responseType
      },
      json: true
    };
  }

  sendErrorResponse() {
    const bodyText = `:warning: error searching for *${
      this.searchTerm
    }* on ${this.site} please try again :warning:`;

    rp(this.options(bodyText))
    .then(results => {
      console.log('successfully responded with ERROR to slack');
    })
    .catch(error => {
      console.log(`failed responding with ERROR to slack: ${error.message}`);
    });
  }

  sendNoUrlsResponse(ext = 'gif') {
    const bodyText = `:zero: ${ext}s found for *${
      this.searchTerm
    }* on ${this.site} :thumbsdown:`;

    rp(this.options(bodyText))
    .then(results => {
      console.log('successfully responded with NO URL to slack');
    })
    .catch(error => {
      console.log(`failed responding with NO URL to slack: ${error.message}`);
    });
  }

  sendUrlResponse(url, user) {
    const bodyText = `${user} requested <${url}|${this.searchTerm}>`;

    rp(this.options(bodyText, 'in_channel'))
    .then(results => {
      console.log(`successfully responded with ${url} to slack`);
    })
    .catch(error => {
      console.log(`failed responding with ${url} to slack: ${error.message}`);
    });
  }
}
