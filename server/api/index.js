import { Router } from 'express';
import { Imgur } from './../models/imgur';
import { Reddit } from './../models/reddit';
import { Gfycat } from './../models/gfycat';

export default function() {
	const api = Router();

	api.post('/images/:site/:ext', (req, res) => {
	 	const site = req.params.site;
		const ext = req.params.ext;
		const searchTerm = req.body.text;
		const user = req.body.user_name;
		const responseUrl = req.body.response_url;

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
				const imgur = new Imgur(responseUrl, user, searchTerm, ext);
				imgur.search();
				break;
			case 'reddit':
				const reddit = new Reddit(responseUrl, user, searchTerm);
				reddit.search();
				break;
			case 'gfycat':
				const gfycat = new Gfycat(responseUrl, user, searchTerm);
				gfycat.search();
				break;
			default:
				console.log('undefined site');
		}
	});

	return api;
}
