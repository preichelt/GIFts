import { Router } from 'express';
import { Imgur } from './../models/imgur';
import { Reddit } from './../models/reddit';
import { Gfycat } from './../models/gfycat';

export default function() {
	const api = Router();

	api.post('/slack/:site/:ext', (req, res) => {
	 	const site = req.params.site;
		const ext = req.params.ext;
		const searchTerm = req.body.text;
		const user = req.body.user_name;
		const responseUrl = req.body.response_url;
		const resType = 'slack';

		console.log(`site: ${site}, ext: ${ext}, searchTerm: ${
			searchTerm
		}, user: ${user}`);

		res.json({
			text: `:mag: searching for *${
				searchTerm
			}* ${ext} on ${site} :hourglass_flowing_sand:`,
			mrkdwn: true
		});

		switch(site) {
			case 'imgur':
				const imgur = new Imgur({
					res: responseUrl,
					resType: resType,
					user: user,
					searchTerm: searchTerm,
					site: site,
					ext: ext
				});

				imgur.search();
				break;
			case 'reddit':
				const reddit = new Reddit({
					res: responseUrl,
					resType: resType,
					user: user,
					searchTerm: searchTerm,
					site: site
				});

				reddit.search();
				break;
			case 'gfycat':
				const gfycat = new Gfycat({
					res: responseUrl,
					resType: resType,
					user: user,
					searchTerm: searchTerm,
					site: site
				});

				gfycat.search();
				break;
			default:
				console.log('undefined site');
		}
	});

	api.get('/gifs/:site', (req, res) => {
		const site = req.params.site;
		const q = req.query.q;

		switch(site) {
			case 'imgur':
				const imgur = new Imgur({
					res: res,
					resType: 'json',
					searchTerm: q,
					site: site,
					ext: 'gif'
				});

				imgur.search();
				break;
			case 'reddit':
				const reddit = new Reddit({
					res: res,
					resType: 'json',
					searchTerm: q,
					site: site
				});

				reddit.search();
				break;
			case 'gfycat':
				const gfycat = new Gfycat({
					res: res,
					resType: 'json',
					searchTerm: q,
					site: site
				});

				gfycat.search();
				break;
			default:
				const error = 'undefined site';
				console.log(error);
				res.json({error: error});
		}
	});

	return api;
}
