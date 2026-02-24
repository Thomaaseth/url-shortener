import express, { type Request, type Response } from 'express'
import urlRoutes from './src/routes/url.routes'

const app = express()
const port = process.env.PORT

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
});

app.use('/url', urlRoutes)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});


// flow for creating a short url
// POST request with url in req.body
// extract url from the query
// validate it's a valid url
// try to generate a randomized shortcode
// extract with slice the (2, 8) 6 chars generated previously
// check if it exists in the db
// if it exists, retry the generate and then check
// if it doesn't exists, continue
// db.insert the url object
// reconstruct a working url with the shortcode
// res with status 201, send the shortened url