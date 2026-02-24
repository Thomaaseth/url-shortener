export function isValidUrl(url: string) {
    try {
        const newUrl = new URL(url);
        console.log(newUrl)
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (error) {
        return false;
    }
}

export function generateShortCode() {
    try {
        const randomNum = Number.parseFloat(Math.random().toFixed(6));
        const randomString = randomNum.toString(36);
        const shortCode = randomString.slice(2, 8);
        return shortCode;
    } catch (error) {
        throw new Error('Error generating short code')
    }
}

