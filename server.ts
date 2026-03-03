import express from 'express'
import urlRoutes from './src/routes/url.routes'
import path, { dirname } from 'path'

const app = express()
const port = process.env.PORT

app.use(express.json())


app.use('/', express.static(path.join(__dirname, 'src/public')))

// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello world')
// });

app.use('/url', urlRoutes)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

