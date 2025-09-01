function parseUrl(fullUrl) {
    try {
        const parsed = new URL(fullUrl);
        const queryParams = {};
        parsed.searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });
        return {
            hostname: parsed.hostname,
            pathname: parsed.pathname,
            query: queryParams
        };
    } catch (err) {
        return { error: "Invalid URL" };
    }
}

module.exports = { parseUrl };
