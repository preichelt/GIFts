import { Router } from 'express';
import { imgur, reddit } from './../models/gif';

export default function() {
	var api = Router();

	api.post('/gifs/imgur', (req, res) => {
		let searchTerm = req.body.text;
		let user = req.body.user_name;
		let responseUrl = req.body.response_url;

		res.json({
			text: `:mag: searching for *${searchTerm}* on imgur :hourglass_flowing_sand:`,
			mrkdwn: true
		});

		imgur(searchTerm, user, responseUrl);
	});

	api.post('/gifs/reddit', (req, res) => {
		let searchTerm = req.body.text;
		let user = req.body.user_name;
		let responseUrl = req.body.response_url;

		res.json({
			text: `:mag: searching for *${searchTerm}* on reddit :hourglass_flowing_sand:`,
			mrkdwn: true
		});

		reddit(searchTerm, user, responseUrl);
	});

	return api;
}
