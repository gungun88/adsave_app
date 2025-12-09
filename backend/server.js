
const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Reusable browser instance
let browser = null;

// Initialize browser on startup
const initBrowser = async () => {
  if (!browser) {
    console.log('Initializing browser...');
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });
    console.log('Browser initialized');
  }
  return browser;
};

// Get or create browser instance
const getBrowser = async () => {
  if (!browser || !browser.isConnected()) {
    browser = null;
    return await initBrowser();
  }
  return browser;
};

// Helper: Format bytes to MB/KB
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return 'Unknown';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper: Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/api/parse', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes('facebook.com/ads/library')) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  console.log(`[Start] Processing: ${url}`);

  let context = null;
  try {
    // Get or create browser (reusing existing instance)
    const browserInstance = await getBrowser();

    const context = await browserInstance.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      locale: 'en-US',
      timezoneId: 'America/Los_Angeles'
    });

    const page = await context.newPage();

    // Variables to capture
    let videoUrl = null;
    let posterUrl = null;
    let fileSize = null; // To store content-length

    // INTERCEPT NETWORK TRAFFIC - More aggressive blocking
    await page.route('**/*', async (route) => {
        const request = route.request();
        const resourceType = request.resourceType();
        const url = request.url();

        // Block fonts and stylesheets
        if (['font', 'stylesheet'].includes(resourceType)) {
            return route.abort();
        }

        // Block tracking and analytics
        if (url.includes('google-analytics') ||
            url.includes('doubleclick') ||
            url.includes('facebook.com/tr') ||
            url.includes('connect.facebook.net')) {
            return route.abort();
        }

        return route.continue();
    });

    page.on('response', async (response) => {
      const type = response.request().resourceType();
      const respUrl = response.url();
      const headers = response.headers();

      // Check for video streams
      if ((type === 'media' || respUrl.includes('.mp4')) && !videoUrl) {
        // Simple filter: ignore tiny files (under 50KB) that might be icons/previews
        const length = headers['content-length'];
        if (length && parseInt(length) > 50000) {
            console.log('Found Video URL:', respUrl);
            videoUrl = respUrl;
            fileSize = parseInt(length);
        }
      }
      
      // Try to find the poster image (looking for fbcdn images that are decent size)
      if (type === 'image' && respUrl.includes('fbcdn') && !posterUrl) {
         // Heuristic: check if URL looks like a main content image
         if (respUrl.includes('s1080x1080') || respUrl.includes('s720x720')) {
             posterUrl = respUrl;
         }
      }
    });

    // Navigate to the page - Reduced timeout
    console.log('Navigating to page...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait specifically for the ad container to ensure dynamic content loads
    // Instead of waiting for networkidle (which can be flaky on FB), we wait for generic text
    try {
        await page.waitForSelector('div[role="main"], div[aria-label="Ad details"]', { timeout: 10000 });
    } catch (e) {
        console.log('Main container wait timeout, proceeding anyway...');
    }

    // Scroll to trigger lazy loading - Reduced delay
    await page.evaluate(() => window.scrollTo(0, 500));
    await delay(500); // Reduced from 1000ms

    // DOM Extraction Strategy (Robust)
    console.log('Extracting DOM data...');
    const adInfo = await page.evaluate(() => {
      try {
        // 1. Detect Status
        const allSpans = Array.from(document.querySelectorAll('span'));
        const activeSpan = allSpans.find(s => s.innerText === 'Active' || s.innerText === 'Inactive');
        const isActive = activeSpan ? activeSpan.innerText === 'Active' : true;

        // 2. Detect Publisher Name - Multiple strategies
        let publisherName = 'Unknown Publisher';

        // Blacklist of common non-publisher texts
        const blacklist = [
          'Active status', 'Active', 'Inactive', 'Ad Library',
          'Learn More', 'Sign Up', 'Shop Now', 'Sponsored',
          'Apply Now', 'Download', 'See More', 'Watch Video',
          'Search by keyword or advertiser', 'See ad details',
          'Page transparency', 'Go to Page'
        ];

        // Helper function to check if text is valid publisher name
        const isValidPublisherName = (text) => {
          if (!text) return false;
          const trimmed = text.trim();
          if (trimmed.length < 2 || trimmed.length > 100) return false;
          if (blacklist.includes(trimmed)) return false;
          if (trimmed.toLowerCase().includes('status')) return false;
          if (trimmed.toLowerCase().includes('sponsored')) return false;
          if (trimmed.toLowerCase().includes('active')) return false;
          if (trimmed.toLowerCase().includes('search')) return false;
          if (trimmed.toLowerCase().includes('keyword')) return false;
          if (trimmed.toLowerCase().includes('advertiser')) return false;
          if (trimmed.includes('•')) return false; // Avoid bullet points
          return true;
        };

        // Strategy 1: Look for the advertiser name near "Sponsored" label
        const allText = document.body.innerText;
        const sponsoredIndex = allText.indexOf('Sponsored');
        if (sponsoredIndex !== -1) {
          // The advertiser name is usually right before "Sponsored"
          const beforeSponsored = allText.substring(Math.max(0, sponsoredIndex - 200), sponsoredIndex);
          const lines = beforeSponsored.split('\n').filter(l => l.trim());
          // Get the last non-empty line before "Sponsored"
          for (let i = lines.length - 1; i >= 0; i--) {
            if (isValidPublisherName(lines[i])) {
              publisherName = lines[i].trim();
              console.log('Publisher found near Sponsored label:', publisherName);
              break;
            }
          }
        }

        // Strategy 2: H1 tag
        if (publisherName === 'Unknown Publisher') {
          const h1 = document.querySelector('h1');
          if (h1 && isValidPublisherName(h1.innerText)) {
              publisherName = h1.innerText.trim();
              console.log('Publisher found via H1:', publisherName);
          }
        }

        // Strategy 3: Look for aria-label with "Page" or advertiser name
        if (publisherName === 'Unknown Publisher') {
          const ariaLabels = Array.from(document.querySelectorAll('[aria-label*="Page"]'));
          for (const el of ariaLabels) {
            const text = el.getAttribute('aria-label');
            if (isValidPublisherName(text)) {
              publisherName = text.trim();
              console.log('Publisher found via aria-label:', publisherName);
              break;
            }
          }
        }

        // Strategy 4: Look for H2 tags
        if (publisherName === 'Unknown Publisher') {
          const allH2 = Array.from(document.querySelectorAll('h2'));
          const advertiserH2 = allH2.find(h => isValidPublisherName(h.innerText));
          if (advertiserH2) {
            publisherName = advertiserH2.innerText.trim();
            console.log('Publisher found via H2:', publisherName);
          }
        }

        // Strategy 5: Look for strong or bold text
        if (publisherName === 'Unknown Publisher') {
          const strongTags = Array.from(document.querySelectorAll('strong, b'));
          const publisherStrong = strongTags.find(s => isValidPublisherName(s.innerText));
          if (publisherStrong) {
            publisherName = publisherStrong.innerText.trim();
            console.log('Publisher found via strong:', publisherName);
          }
        }

        // Strategy 6: Look for spans (but more careful filtering)
        if (publisherName === 'Unknown Publisher') {
          const allSpans = Array.from(document.querySelectorAll('span'));
          // Sort by text length descending to prioritize more substantial names
          const sortedSpans = allSpans
            .filter(span => isValidPublisherName(span.innerText))
            .sort((a, b) => b.innerText.trim().length - a.innerText.trim().length);

          if (sortedSpans.length > 0) {
            publisherName = sortedSpans[0].innerText.trim();
            console.log('Publisher found via span:', publisherName);
          }
        }

        // Strategy 7: Profile link
        if (publisherName === 'Unknown Publisher') {
          const profileLinks = document.querySelectorAll('a[href*="facebook.com/"]');
          for (const link of profileLinks) {
            const spans = link.querySelectorAll('span');
            for (const span of spans) {
              if (isValidPublisherName(span.innerText)) {
                publisherName = span.innerText.trim();
                console.log('Publisher found via profile link:', publisherName);
                break;
              }
            }
            if (publisherName !== 'Unknown Publisher') break;
          }
        }

        // 3. Detect Primary Text (Ad Copy)
        let primaryText = 'No text found';
        const textDiv = document.querySelector('div[style*="white-space: pre-wrap"]');
        if (textDiv) {
            primaryText = textDiv.innerText;
        } else {
            const divs = Array.from(document.querySelectorAll('div[dir="auto"]'));
            if (divs.length > 0) {
              const sorted = divs.sort((a, b) => b.innerText.length - a.innerText.length);
              primaryText = sorted[0].innerText;
            }
        }

        // 4. CTA
        const ctaButton = Array.from(document.querySelectorAll('div[role="button"]'))
          .find(b => ['Learn More', 'Sign Up', 'Shop Now', 'Apply Now', 'Download'].some(t => b.innerText.includes(t)));
        const ctaType = ctaButton ? ctaButton.innerText : 'Learn More';

        // 5. Publisher Avatar - try to find profile image
        let publisherAvatar = 'https://via.placeholder.com/50';
        const images = Array.from(document.querySelectorAll('img'));

        console.log(`Found ${images.length} images on the page`);

        // Strategy 1: Look for circular images (profile pictures are usually circular)
        const circularImg = images.find(img => {
          if (!img.src || !img.src.includes('fbcdn')) return false;
          if (img.src.includes('emoji')) return false;
          const style = window.getComputedStyle(img);
          const borderRadius = style.borderRadius;
          console.log('Checking image:', img.src.substring(0, 80), 'borderRadius:', borderRadius);
          return borderRadius === '50%' || borderRadius.includes('50');
        });

        if (circularImg) {
          publisherAvatar = circularImg.src;
          console.log('Found circular avatar:', publisherAvatar.substring(0, 80));
        } else {
          // Strategy 2: Look for small fbcdn images (likely profile pics)
          const profileImg = images.find(img => {
            if (!img.src || !img.src.includes('fbcdn')) return false;
            if (img.src.includes('emoji')) return false;
            const width = img.width || img.naturalWidth;
            const height = img.height || img.naturalHeight;
            console.log('Checking image size:', img.src.substring(0, 80), 'size:', width, 'x', height);
            return width > 0 && width <= 150 && height > 0 && height <= 150;
          });
          if (profileImg) {
            publisherAvatar = profileImg.src;
            console.log('Found small avatar:', publisherAvatar.substring(0, 80));
          }
        }

        if (publisherAvatar === 'https://via.placeholder.com/50') {
          console.log('No suitable avatar found, using placeholder');
        }

        return {
          isActive,
          primaryText,
          publisherName,
          publisherAvatar,
          ctaType,
          success: true
        };
      } catch (e) {
        return {
          isActive: true,
          primaryText: 'Error extracting text',
          publisherName: 'Unknown Publisher',
          publisherAvatar: 'https://via.placeholder.com/50',
          ctaType: 'Learn More',
          success: false,
          error: e.toString()
        };
      }
    });

    console.log('DOM extraction result:', adInfo);

    // Fallback if network intercept didn't catch video (e.g. cached)
    if (!videoUrl) {
      console.log('Network intercept empty, trying DOM video src...');
      videoUrl = await page.evaluate(() => {
        const v = document.querySelector('video');
        return v ? v.src : null;
      });
    }

    if (!videoUrl) {
      throw new Error('Could not find video URL. The ad might be an image ad or expired.');
    }

    // Extract video duration from the video element
    let videoDuration = 'Unknown';
    try {
      console.log('Extracting video duration...');
      videoDuration = await page.evaluate(() => {
        const video = document.querySelector('video');
        if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
          const duration = Math.floor(video.duration);
          const minutes = Math.floor(duration / 60);
          const seconds = duration % 60;
          return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        return null;
      });

      // If duration is not available yet, wait a bit and try again - Reduced delay
      if (!videoDuration) {
        console.log('Duration not ready, waiting for video metadata...');
        await delay(1000); // Reduced from 1500ms
        videoDuration = await page.evaluate(() => {
          const video = document.querySelector('video');
          if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
            const duration = Math.floor(video.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
          }
          return 'Unknown';
        });
      }

      console.log('Video duration:', videoDuration);
    } catch (e) {
      console.log('Failed to extract duration:', e.message);
      videoDuration = 'Unknown';
    }

    // Enhanced poster extraction from video element
    if (!posterUrl) {
      console.log('Network intercept poster empty, trying DOM video poster...');
      posterUrl = await page.evaluate(() => {
        const v = document.querySelector('video');
        if (v && v.poster) {
          return v.poster;
        }
        // Fallback: look for high-res fbcdn images
        const images = Array.from(document.querySelectorAll('img'));
        const thumbnail = images.find(img =>
          img.src &&
          img.src.includes('fbcdn') &&
          (img.src.includes('s1080x1080') ||
           img.src.includes('s720x720') ||
           img.src.includes('_n.jpg') ||
           img.src.includes('_n.png')) &&
          img.width > 200
        );
        return thumbnail ? thumbnail.src : null;
      });
    }

    console.log('✅ Successfully extracted ad data');
    console.log('Final posterUrl:', posterUrl);

    // Return the result
    res.json({
      id: new URL(url).searchParams.get('id'),
      ...adInfo,
      videoUrl: videoUrl,
      posterUrl: posterUrl || 'https://via.placeholder.com/400x400?text=No+Cover',
      videoDuration: videoDuration,
      fileSize: formatBytes(fileSize), // Now using real size
      resolution: 'HD'
    });

  } catch (error) {
    console.error('Error processing:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  } finally {
    // Close only the context, not the browser (for reuse)
    if (context) {
      await context.close();
    }
  }
});

// Download proxy endpoint
app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log(`[Download] Proxying: ${url.substring(0, 100)}...`);

  try {
    const https = require('https');
    const http = require('http');
    const urlModule = require('url');

    const parsedUrl = urlModule.parse(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    protocol.get(url, (downloadResponse) => {
      // Set headers to force download
      res.setHeader('Content-Type', downloadResponse.headers['content-type'] || 'application/octet-stream');
      res.setHeader('Content-Length', downloadResponse.headers['content-length'] || '0');
      res.setHeader('Content-Disposition', 'attachment');

      // Pipe the response
      downloadResponse.pipe(res);
    }).on('error', (error) => {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Download failed' });
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
