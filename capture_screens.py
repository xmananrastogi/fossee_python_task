import asyncio
from playwright.async_api import async_playwright

async def capture_screenshots():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        # Desktop Before
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        try:
            await page.goto("http://localhost:8002", wait_until="networkidle")
            await page.screenshot(path="static/overhaul/screenshots/before_desktop.png", full_page=True)
            print("Captured before_desktop.png")
        except Exception as e:
            print(f"Failed to capture before_desktop.png: {e}")
            
        # Desktop After
        try:
            await page.goto("http://localhost:8001", wait_until="networkidle")
            await page.screenshot(path="static/overhaul/screenshots/after_desktop.png")
            print("Captured after_desktop.png")
            
            # Additional screens for after
            await page.click("button:has-text('EXPLORE_WORKSHOPS')")
            await page.wait_for_timeout(1000)
            await page.screenshot(path="static/overhaul/screenshots/after_catalog.png")
            print("Captured after_catalog.png")
            
            # Dashboard
            await page.goto("http://localhost:8001", wait_until="networkidle")
            await page.evaluate("localStorage.setItem('isAuthenticated', 'true'); localStorage.setItem('token', 'mock_token_123');")
            await page.goto("http://localhost:8001", wait_until="networkidle")
            await page.click("text=DASHBOARD")
            await page.wait_for_timeout(1000)
            await page.screenshot(path="static/overhaul/screenshots/after_dashboard.png")
            print("Captured after_dashboard.png")
            
        except Exception as e:
             print(f"Failed to capture after desktop screenshots: {e}")

        # Mobile After
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            is_mobile=True,
            has_touch=True
        )
        mobile_page = await context.new_page()
        try:
            await mobile_page.goto("http://localhost:8001", wait_until="networkidle")
            await mobile_page.screenshot(path="static/overhaul/screenshots/after_mobile.png")
            print("Captured after_mobile.png")
            
            await mobile_page.click(".mobile-toggle")
            await mobile_page.wait_for_timeout(500)
            await mobile_page.screenshot(path="static/overhaul/screenshots/after_mobile_menu.png")
            print("Captured after_mobile_menu.png")

        except Exception as e:
            print(f"Failed to capture mobile screenshots: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(capture_screenshots())
