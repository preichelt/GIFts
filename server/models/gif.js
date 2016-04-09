import rp from 'request-promise';
import _replace from 'lodash/replace';
import _filter from 'lodash/filter';
import _reverse from 'lodash/reverse';
import _each from 'lodash/each';
import _times from 'lodash/times';
import _random from 'lodash/random';
import _split from 'lodash/split';

export function imgur (searchTerm, user, responseUrl) {
  console.log(`user: ${user}, searchTerm: ${searchTerm}`);

  let imgurAllOfOptions = {
    method: 'POST',
    uri: `http://imgur.com/search/score/all.json?q_type=gif&q_all=${_replace(searchTerm, ' ', '%20')}`,
    headers: {
      referer: 'http://imgur.com'
    },
    json: true
  };

  const slackOptions = {
    method: 'POST',
    uri: responseUrl,
    json: true
  };

  rp(imgurAllOfOptions).then(function(imgurAllOfResults) {
    const weightedAllOfGifs = [];

    _each(_reverse(_filter(imgurAllOfResults.data, function(result) {
      return result.nsfw == false;
    })), function(gif, index) {
      // NOTE: Disabling until Slack consistently embeds .gifv
      // let gifvThreshold = 2000000;
      // let ext = `.gif${gif.size < gifvThreshold ? '' : 'v'}`;
      // let url = `http://i.imgur.com/${gif.hash}${ext}`;
      let url = `http://i.imgur.com/${gif.hash}${gif.ext}`;
      let urlArray = _times(index + 1, function(i) { return url });
      weightedAllOfGifs.push(...urlArray);
    });

    if (weightedAllOfGifs.length == 0) {
      slackOptions.body = {
        text: `:zero: gifs found for *${searchTerm}* on imgur :thumbsdown:`,
        mrkdwn: true
      };

      rp(slackOptions).then(function(slackResults) {
        console.log('successfully responded with NO GIF to slack');
      }).catch(function(e) {
        console.log(`failed responding with NO GIF to slack: ${e.message}`);
      });
    } else {
      let gif = weightedAllOfGifs[_random(0, weightedAllOfGifs.length - 1)];

      slackOptions.body = {
        text: `${user} requested *${searchTerm}* \n ${gif}`,
        mrkdwn: true,
        response_type: 'in_channel'
      };

      rp(slackOptions).then(function(slackResults) {
        console.log(`successfully responded with ${gif} to slack`);
      }).catch(function(e) {
        console.log(`failed responding with ${gif} to slack: ${e.message}`);
      });
    }
  }).catch(function(imgurAllOfError) {
    slackOptions.body = {
      text: `:warning: error searching imgur for *${searchTerm}* please try again :warning:`,
      mrkdwn: true
    };

    rp(slackOptions).then(function(slackResults) {
      console.log('successfully responded with ERROR to slack');
    }).catch(function(e) {
      console.log(`failed responding with ERROR to slack: ${e.message}`);
    });
  });
}

export function reddit (searchTerm, user, responseUrl) {
  console.log(`user: ${user}, searchTerm: ${searchTerm}`);

  let subreddits = [
    'gifs',
    'gif',
    'reactiongifs',
    'highqualitygifs',
    'WastedGifs',
    'CatGifs',
    'doggifs',
    'Cinemagraphs',
    'GifRecipes',
    'educationalgifs',
    'combinedgifs',
    'aww_gifs',
    'chemicalreactiongifs',
    'physicsgifs',
    'mechanical_gifs',
    'michaelbaygifs',
    'gifextra',
    'reversegif',
    'noisygifs',
    'dashcamgifs',
    'DubbedGIFS',
    'SuperAthleteGifs',
    'shittyreactiongifs',
    'catreactiongifs',
    'gaminggifs',
    'InterestingGifs',
    'funny_gifs',
    'AnimalTextGifs',
    'GamePhysics',
    'analogygifs',
    'SpaceGifs',
    'K_gifs',
    'blackpeoplegifs',
    'StartledCats',
    'IdiotsFightingThings',
    'SlyGifs',
    'FullMovieGifs',
    'NatureGifs',
    'seinfeldgifs',
    'CorgiGifs',
    'perfectloops',
    'ScienceGIFs',
    'EarthPornGifs',
    'SuperSaiyanGifs',
    'FractalGifs',
    'OpticalIllusionGifs',
    'WeatherGifs',
    'RedneckGifs',
    'creepy_gif',
    'mathgifs',
    'BetterEveryLoop',
    'Puggifs',
    'mesmerizinggifs',
    'kittengifs',
    'hiphopgifs',
    'destructiongifs',
    'plantgifs',
    'breathinginformation',
    'soccergifs',
    'fail_gifs',
    'cringegifs'
  ].join('+');

  let redditOptions = {
    uri: `https://www.reddit.com/r/${subreddits}/search.json`,
    headers: {
      referer: 'https://www.reddit.com'
    },
    qs: {
      q: _replace(searchTerm, ' ', '+'),
      restrict_sr: 'on',
      sort: 'relevance',
      t: 'all'
    },
    json: true
  };

  const slackOptions = {
    method: 'POST',
    uri: responseUrl,
    json: true
  };

  rp(redditOptions).then(function(redditResults) {
    const weightedGifs = [];

    _each(_reverse(_filter(redditResults.data.children, function(result) {
      let url = result.data.url;

      return url.includes('imgur') && !(
        url.includes('gallery') ||
        url.includes('jpg') ||
        url.includes('png') ||
        url.includes('/a/') ||
        url.includes('/r/')
      );
    })), function(result, index) {
      let url = `${_split(result.data.url, '.gif')[0]}.gif`;
      let urlArray = _times(index + 1, function(i) { return url });
      weightedGifs.push(...urlArray);
    });

    if (weightedGifs.length == 0) {
      slackOptions.body = {
        text: `:zero: gifs found for *${searchTerm}* on reddit :thumbsdown:`,
        mrkdwn: true
      };

      rp(slackOptions).then(function(slackResults) {
        console.log('successfully responded with NO GIF to slack');
      }).catch(function(e) {
        console.log(`failed responding with NO GIF to slack: ${e.message}`);
      });
    } else {
      let gif = weightedGifs[_random(0, weightedGifs.length - 1)];

      slackOptions.body = {
        text: `${user} requested *${searchTerm}* \n ${gif}`,
        mrkdwn: true,
        response_type: 'in_channel'
      };

      rp(slackOptions).then(function(slackResults) {
        console.log(`successfully responded with ${gif} to slack`);
      }).catch(function(e) {
        console.log(`failed responding with ${gif} to slack: ${e.message}`);
      });
    }

  }).catch(function(err) {
    console.log("errors");
    slackOptions.body = {
      text: `:warning: error searching reddit for *${searchTerm}* please try again :warning:`,
      mrkdwn: true
    };

    rp(slackOptions).then(function(slackResults) {
      console.log('successfully responded with ERROR to slack');
    }).catch(function(e) {
      console.log(`failed responding with ERROR to slack: ${e}`);
    });
  });
}
