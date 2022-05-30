import { Request, Response } from 'express'
import shortId from 'shortid'
import { config } from 'config/Constants'
import { URLModel } from 'database/model/URL'

export class URLController {
	public async shorten(req: Request, response: Response): Promise<void> {
        //verificar existancia da url
		const { originURL } = req.body
		const url = await URLModel.findOne({ originURL })
		if (url) {
			response.json(url)
			return
		}
        //criar hash pra url
		const hash = shortId.generate()
		const shortURL = `${config.API_URL}/${hash}`
        //salvar url no banco
		const newURL = await URLModel.create({ hash, originURL, shortURL })
		response.json(newURL)
	}

	public async redirect(req: Request, response: Response): Promise<void> {
		const { hash } = req.params
		const url = await URLModel.findOne({ hash })

		if (url) {
			response.redirect(url.originURL)
			return
		}

		response.status(400).json({ error: 'URL not found' })
	}
}