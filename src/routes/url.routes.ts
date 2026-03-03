import express, { type Request, type Response } from 'express'
import { updateCount, updateLongUrl, deleteShortCode, getCount } from '../repository/db.operations'
import { isValidUrl, generateUniqueShortCode } from '../../src/services/url.services'
import { url } from '../db/schema'


const router = express.Router()


// CREATE SHORTENED URL
router.post('/', async (req: Request, res: Response) => {
    const longUrl = req.body.url;

    // validate input
    if (!longUrl || !isValidUrl(longUrl)) {
        return res.status(400).json({ message: 'Please enter a valid url'})
    }

    try {
        const shortCode = await generateUniqueShortCode(longUrl)
        const shortenedUrl = `${process.env.BASE_URL}/${shortCode}`
        return res.status(201).json({'Shortened url': shortenedUrl})   
    } catch (error) {
        if (error instanceof Error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal server error'})
        }
        return res.status(500).json({ message: `Error generating a url shortcode`})
    }
})

// RETRIEVE SHORT URL AND UPDATE COUNT
router.get('/shortened/:shortCode', async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;

    try {
        const urlObject = await updateCount(shortCode)

        if (urlObject.length < 1) {
            res.status(404).json({ message: `The url doesn't exist`})
            return
        } else {
            // res.status(200).json({ urlObject });
            return res.redirect(urlObject[0]!.url)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal server error' })
        }
        return res.status(500).json({ message: `Error retrieving short url`})
    }
})

// UPDATE SHORT URL
router.put('/shortened/:shortCode', async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;
    const newUrl = req.body.url;

    // check url is valid
    if (!newUrl || !isValidUrl(newUrl)) {
        return res.status(400).json({ message: 'Please enter a valid url'})
    }

    try {
        const newUrlObject = await updateLongUrl(newUrl, shortCode)
        if (newUrlObject.length < 1) {
            res.status(404).json({ message: `The url doesn't exist`})
            return;
        } else {
            return res.status(200).json({ message: 'Successfully updated the url', newUrlObject })
        }               
    } catch (error) {
        if (error instanceof Error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal server error' })
        }
        return res.status(500).json({ message: `Error updating the url`})
        }
})

router.delete('/shortened/:shortCode', async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;

    try {
        const result = await deleteShortCode(shortCode)
        if (result.length > 0) {
            return res.status(204).send()
        } else {
            return res.status(404).json({ message: 'Url not found'})
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal server error' })
        }
        return res.status(500).json({ message: `Error deleting the url`})
    }
})

// GET COUNT
router.get('/shortened/:shortCode/stats', async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;
      
    try {
        const urlObject = await getCount(shortCode)
        if (urlObject.length < 1) {
            res.status(404).json({ message: `The url doesn't exist`})
            return
        } else {
            // return res.status(200).json({ count: urlObject[0].count });
            return res.status(200).json({ urlObject })
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal server error' })
        }
        return res.status(500).json({ message: `Error retrieving short url`})
        }
})

export default router;