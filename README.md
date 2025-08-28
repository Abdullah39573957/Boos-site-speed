# Render Blocking Scripts Tools

This repo contains two JavaScript utilities for identifying and optimizing render-blocking scripts on websites.

---

## Files

### 1. `render-blocking-analyzer.js`
- **Purpose:** Diagnostic tool.
- **Usage:** Run directly inside your browser’s Developer Tools console.
- **What it does:**  
  - Scans the page for `<script>` tags.  
  - Finds scripts that block rendering (no `async` or `defer` attributes).  
  - Fetches file sizes using `HEAD` requests.  
  - Outputs a clean table in the console with:  
    - URL  
    - Domain  
    - File size (KB)  

👉 **When to use:**  
Run this in the console if you want to check which scripts are slowing down your site.

---

### 2. `delayed-script-loader.js`
- **Purpose:** Optimization tool.
- **Usage:** Add to your website (via WordPress Code Snippets, `functions.php`, or footer HTML widget).
- **What it does:**  
  - Waits until the entire page has loaded (HTML, CSS, images, etc.).  
  - Then dynamically injects a non-critical script into the `<head>`.  
  - Ensures the page renders before loading extra scripts.  

👉 **When to use:**  
Use this for scripts that are **not critical** to the first page render (e.g., analytics, ads, chat widgets).

---

## Example Use in WordPress

### Using Code Snippets Plugin
1. Install [Code Snippets](https://wordpress.org/plugins/code-snippets/).
2. Create a new snippet → select **JavaScript**.
3. Paste the contents of `delayed-script-loader.js`.
4. Set to run on the **Frontend**.

### Using Child Theme (`functions.php`)
```php
add_action('wp_footer', function() { ?>
    <script>
    window.addEventListener('load', () => {
        const script = document.createElement('script');
        script.src = 'https://example.com/non-critical-script.js';
        document.head.appendChild(script);
    });
    </script>
<?php });
