import { Router } from 'express';
import rp from 'request-promise';

export default function() {
	var api = Router();

	api.post('/gifs', (req, res, next) => {
		res.json({
			text: ':mag: searching... :hourglass_flowing_sand:'
		});

		next();
	});

	api.use((req, res, next) => {
		let searchTerm = req.body.text.replace(' ', '+');
		console.log(`searchTerm: ${searchTerm}`);

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
		  qs: {
		    q: searchTerm,
		    restrict_sr: 'on',
		    sort: 'relevance',
		    t: 'all'
		  },
		  json: true
		};

		const slackOptions = {
			method: 'POST',
			uri: req.body.response_url,
			json: true
		};

		rp(redditOptions).then(function(redditResults) {
		  const gifs = redditResults.data.children.map(function(result) {
		    return result.data.url;
		  });

			const weightedGifs = [];

			gifs.reverse().forEach(function(url, index) {
				var cleanedUrl = null;

				if (url.includes('imgur') && !(url.includes('gallery') || url.includes('jpg') || url.includes('png'))) {
					cleanedUrl = `${url.split('.gif')[0]}.gif`;
				}

				if (cleanedUrl != null){
					weightedGifs.push(cleanedUrl);
					var i = 0;
					while (i < index) {
						weightedGifs.push(cleanedUrl);
						i++;
					}
				}
			});

			if (weightedGifs.length == 0) {
				slackOptions.body = {
					text: ':zero: gifs found :thumbsdown:'
				};

				rp(slackOptions).then(function(slackResults) {
					console.log('successfully responded with NO GIF to slack');
				}).catch(function(e) {
					console.log(`failed responding with NO GIF to slack: ${e.message}`);
				});
			} else {
				let gif = weightedGifs[Math.floor(Math.random() * weightedGifs.length)];

				slackOptions.body = {
					text: gif,
					response_type: 'in_channel'
				};

		    rp(slackOptions).then(function(slackResults) {
					console.log('successfully responded with GIF to slack');
				}).catch(function(e) {
					console.log(`failed responding with GIF to slack: ${e.message}`);
				});
			}

		}).catch(function(err) {
			slackOptions.body = {
				text: err.message
			};

			rp(slackOptions).then(function(slackResults) {
				console.log('successfully responded with ERROR to slack');
			}).catch(function(e) {
				console.log(`failed responding with ERROR to slack: ${e.message}`);
			});
		});

		next();
	});

	return api;
}
