/**
 * This script analyzes the entire page to identify and report on
 * render-blocking JavaScript files.
 *
 * A script is considered render-blocking if it is present in the document
 * and does not have the 'async' or 'defer' attributes.
 *
 * The script will output a table to the console with the following details
 * for each render-blocking script:
 * - URL
 * - Domain (now simplified to remove subdomains)
 * - File Size (in kilobytes, from the Content-Length header)
 *
 * To use this script, simply copy and paste the entire code block into
 * your browser's developer tools console and press Enter.
 */
(async () => {
    // A utility function to fetch the file size of a given URL.
    // It uses the HEAD method to avoid downloading the entire file.
    const getFileSize = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                const contentLength = response.headers.get('content-length');
                return contentLength ? parseInt(contentLength, 10) : 'N/A';
            }
        } catch (error) {
            console.error(`Could not fetch size for ${url}:`, error);
        }
        return 'Unavailable';
    };

    // An array to hold information about the render-blocking scripts found.
    const renderBlockingScripts = [];

    // Select all script tags with a 'src' attribute anywhere in the document.
    const scriptElements = document.querySelectorAll('script[src]');

    // Filter for scripts that are render-blocking.
    // A script is render-blocking if it lacks 'async' and 'defer' attributes.
    const blockingScripts = Array.from(scriptElements).filter(script =>
        !script.hasAttribute('async') && !script.hasAttribute('defer')
    );

    // If no render-blocking scripts are found, let the user know.
    if (blockingScripts.length === 0) {
        console.log('🎉 No render-blocking scripts were found on the entire page. Good job!');
        return;
    }

    // Process each render-blocking script to gather details.
    const promises = blockingScripts.map(async (script) => {
        const url = script.src;
        let domain = 'Unknown';

        try {
            // Get the full hostname and then extract the top-level domain.
            const hostname = new URL(url).hostname;
            const parts = hostname.split('.');
            // Handle simple domains like 'localhost' or single-level domains.
            if (parts.length > 1) {
                domain = parts.slice(-2).join('.');
            } else {
                domain = hostname;
            }
        } catch (e) {
            // This handles cases where the src is a relative path.
            domain = window.location.hostname.split('.').slice(-2).join('.');
        }

        const fileSizeInBytes = await getFileSize(url);
        // Convert the file size from bytes to KB.
        const fileSizeInKB = typeof fileSizeInBytes === 'number'
            ? (fileSizeInBytes / 1024).toFixed(2)
            : fileSizeInBytes;

        renderBlockingScripts.push({
            URL: url,
            Domain: domain,
            'File Size (KB)': fileSizeInKB
        });
    });

    // Wait for all file size fetches to complete.
    await Promise.all(promises);

    // Output the results as a formatted table in the console.
    console.log('🕵️‍♀️ Found the following render-blocking scripts:');
    console.table(renderBlockingScripts);
})();
