const axios = require('axios')
const url = require('url')
const debug = require('debug')('sfy:fetchCoverLink')

module.exports.fetchCoverLink = (query) => {
	return new Promise((resolve, reject) => {
		const payload = {
			cx: 'eef1ecf270e8e92bc',
			q: query,
			searchType: 'image',
			key: process.env.SEARCH_ENGINE_KEY,
		}
		const params = new url.URLSearchParams(payload)
		const config = {
			method: 'get',
			url: `https://customsearch.googleapis.com/customsearch/v1?${params}`,
		}

		axios(config).then((res) => {
			if (res.data.items) {
				debug(res.data.items[0].link)
				resolve(res.data.items[0].link)
			} else reject(null)
		})
	})
}
