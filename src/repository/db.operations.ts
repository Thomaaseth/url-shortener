import { url } from '../db/schema';
import db from '../../db';
import { eq, sql } from 'drizzle-orm'

export async function createShortCode(longUrl: string, shortCode: string) {
    const newUrlObject = await db.insert(url).values({ url: longUrl, shortCode: shortCode }).returning()
    return newUrlObject;
}

export async function updateCount(shortCode: string) {
    const urlObject = await db.update(url).set({ count: sql`${url.count} +1`}).where(eq(url.shortCode, shortCode)).returning()
    return urlObject;
}

export async function updateLongUrl(newUrl: string, shortCode: string) {
    const newUrlObject = await db.update(url).set({ url: newUrl, updatedAt: new Date()}).where(eq(url.shortCode, shortCode)).returning()
    return newUrlObject;
}

export async function deleteShortCode(shortCode: string) {
    const result = await db.delete(url).where(eq(url.shortCode, shortCode)).returning()
    return result;
}


export async function getCount(shortCode: string) {
    const urlObject = await db.select().from(url).where(eq(url.shortCode, shortCode))
    return urlObject;
}

export async function checkUniqueShortCode(shortCode: string): Promise<boolean> {
    const isUnique = await db.select().from(url).where(eq(url.shortCode, shortCode))
    if (isUnique.length > 0) {
        return false;
    }
    return true;
}