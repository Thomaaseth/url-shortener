import { NeonDbError } from '@neondatabase/serverless'
import { DrizzleQueryError } from 'drizzle-orm'
import { createShortCode } from '../repository/db.operations'

export function isValidUrl(url: string) {
    try {
        const newUrl = new URL(url);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (error) {
        return false;
    }
}

export function generateShortCode() {
        const randomNum = Number.parseFloat(Math.random().toFixed(6));
        const randomString = randomNum.toString(36);
        const shortCode = randomString.slice(2, 8);
        return shortCode;
}

export async function generateUniqueShortCode(longUrl: string): Promise<string> {
    const MAX_ATTEMPTS = 100;
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            const shortCode = generateShortCode()

            try {
                const newUrlObject = await createShortCode(longUrl, shortCode)
                console.log(newUrlObject)
                return shortCode
            } catch (error) {
                if (error instanceof DrizzleQueryError && error.cause instanceof NeonDbError && error.cause.code === '23505') {
                    continue;
            } else {
                throw error;
            }
        }
    }
    throw new Error('Failed to generate a unique shortcode after max attempts')
}