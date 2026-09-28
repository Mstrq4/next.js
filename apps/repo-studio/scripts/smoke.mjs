import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import handler from 'serve-handler'
import { chromium } from 'playwright'

const here = path.dirname(fileURLToPath(import.meta.url))
const publicDirectory = path.resolve(here, '../out')
const routes = [
  '/',
  '/framework',
  '/packages',
  '/tooling',
  '/skills',
  '/evals',
  '/automation',
  '/testing',
  '/benchmarks',
  '/docs',
  '/repository',
]
const viewports = [
  { name: 'compact-320', width: 320, height: 820 },
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 900 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
]

const server = http.createServer((request, response) =>
  handler(request, response, {
    public: publicDirectory,
    cleanUrls: true,
    trailingSlash: false,
  })
)

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
if (!address || typeof address === 'string') throw new Error('Unable to allocate smoke-test port')
const baseURL = 'http://127.0.0.1:' + address.port

let browser
const failures = []

try {
  browser = await chromium.launch({ headless: true, channel: 'chrome' })

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: 'dark',
      reducedMotion: 'no-preference',
    })
    const page = await context.newPage()
    const consoleErrors = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    page.on('pageerror', (error) => consoleErrors.push(error.message))

    for (const route of routes) {
      const response = await page.goto(baseURL + route, { waitUntil: 'networkidle' })
      if (!response?.ok()) {
        failures.push(viewport.name + ' ' + route + ': HTTP ' + (response?.status() ?? 'no response'))
        continue
      }

      const heading = page.locator('h1').first()
      if ((await heading.count()) === 0 || !(await heading.isVisible())) {
        failures.push(viewport.name + ' ' + route + ': missing visible h1')
      }

      const overflow = await page.evaluate(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      if (overflow.scrollWidth > overflow.width + 1) {
        failures.push(viewport.name + ' ' + route + ': horizontal overflow ' + overflow.scrollWidth + ' > ' + overflow.width)
      }
    }

    if (viewport.width <= 390) {
      if (!(await page.locator('.mobile-dock').isVisible())) {
        failures.push(viewport.name + ': mobile dock is not visible')
      }
      if (await page.locator('.studio-sidebar').isVisible()) {
        failures.push(viewport.name + ': desktop sidebar is visible')
      }
    }

    if (viewport.width >= 1024) {
      if (!(await page.locator('.studio-sidebar').isVisible())) {
        failures.push(viewport.name + ': desktop sidebar is not visible')
      }

      if (viewport.width >= 1440) {
        await page.locator('.command-trigger').click()
        if (!(await page.locator('.command-palette').isVisible())) {
          failures.push(viewport.name + ': command palette did not open')
        }
        await page.keyboard.press('Escape')

        const beforeTheme = await page.locator('html').getAttribute('data-theme')
        await page.getByRole('button', { name: 'Toggle color theme' }).click()
        const afterTheme = await page.locator('html').getAttribute('data-theme')
        if (!beforeTheme || !afterTheme || beforeTheme === afterTheme) {
          failures.push(viewport.name + ': theme toggle did not change the active theme')
        }
      }
    }

    if (consoleErrors.length) {
      failures.push(viewport.name + ': console errors: ' + consoleErrors.join(' | '))
    }

    await context.close()
  }
} finally {
  await browser?.close()
  await new Promise((resolve) => server.close(resolve))
}

if (failures.length) {
  console.error('Next Studio smoke failures:')
  for (const failure of failures) console.error('- ' + failure)
  process.exit(1)
}

console.log('Next Studio smoke matrix passed across ' + viewports.length + ' viewport classes and ' + routes.length + ' routes.')
