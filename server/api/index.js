import { Router } from 'express';
import { Imgur } from './../models/imgur';
import { Reddit } from './../models/reddit';

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

		if (site == 'imgur') {
			const imgur = new Imgur(responseUrl, user, searchTerm, ext);
			imgur.search();
		} else if (site == 'reddit') {
			const reddit = new Reddit(responseUrl, user, searchTerm);
			reddit.search();
		}
	});

	return api;
}
