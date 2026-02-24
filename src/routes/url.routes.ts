import express, { type Request, type Response } from 'express'
import { createShortCode, checkUniqueShortCode, updateCount, updateLongUrl, deleteShortCode, getCount } from '../repository/db.operations'
import { isValidUrl, generateShortCode } from '../../src/services/url.services'

const router = express.Router()


// CREATE SHORTENED URL
router.post('/', async (req: Request, res: Response) => {
    const longUrl = req.body.url;

    try {
    // check url is valid
    const validUrl = isValidUrl(longUrl)
    console.log(validUrl)

    // generate shortCode
    if (validUrl) {
        let shortCode = generateShortCode();

        // check that shortCode is unique
        let validateUniqueness = await checkUniqueShortCode(shortCode)
        while (!validateUniqueness) {
            shortCode = generateShortCode();
            validateUniqueness = await checkUniqueShortCode(shortCode)
        }

        const newUrlObject = await createShortCode(longUrl, shortCode)
        console.log(newUrlObject)
        const shortenedUrl = `https://localhost:3000/${shortCode}`
        return res.status(201).json({'Shortened url': shortenedUrl})
        } else {
            return res.status(400).json({ message: `Please enter a valid url`})
        }
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message})
        }
        return res.status(400).json({ message: `Error generating a url shortcode`})
    }
})

// RETRIEVE SHORT URL AND UPDATE COUNT
router.get('/shortened/:shortCode', async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode;

    if (typeof shortCode === 'string') {
        try {
            
            const urlObject = await updateCount(shortCode)

            if (urlObject.length < 1) {
                res.status(404).json({ message: `The url doesn't exist`})
                return
            } else {
                return res.status(200).json({ urlObject });
            }
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message})
            }
            return res.status(400).json({ message: `Error retrieving short url`})
        }
    } else {
        return res.status(400).json({ message: 'Invalid short code' })
    }
})

// UPDATE SHORT URL
router.put('/shortened/:shortCode', async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode;
    const newUrl = req.body.url;
    if (typeof shortCode === 'string') {
        try {
            // check url is valid
            const validUrl = isValidUrl(newUrl)
            if (validUrl) {
                const newUrlObject = await updateLongUrl(newUrl, shortCode)

                if (newUrlObject.length < 1) {
                    res.status(404).json({ message: `The url doesn't exist`})
                    return
                } else {
                    return res.status(200).json({ message: 'Successfully updated the url', newUrlObject })
                }               
            } else {
                return res.status(400).json({ message: 'Please enter a valid url' })
            } 
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message})
            }
            return res.status(400).json({ message: `Error updating the url`})
        }
    } else {
        return res.status(400).json({ message: 'Invalid short code' })
    }
})

router.delete('/shortened/:shortCode', async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode;
    if (typeof shortCode === 'string') {
        try {
            const result = await deleteShortCode(shortCode)
            if (result.length > 0) {
                return res.status(204).send()
            } else {
                return res.status(404).json({ message: 'Url not found'})
            }
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message})
            }
            return res.status(400).json({ message: `Error deleting the url`})
        }
    } else {
        return res.status(400).json({ message: 'Invalid short code' })
    }
})

// GET COUNT
router.get('/shortened/:shortCode/stats', async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode;

    if (typeof shortCode === 'string') {
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
                return res.status(400).json({ message: error.message})
            }
            return res.status(400).json({ message: `Error retrieving short url`})
        }
    } else {
        return res.status(400).json({ message: 'Invalid short code' })
    }
})

export default router;