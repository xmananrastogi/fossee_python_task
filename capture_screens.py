import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        # 1. Desktop - Home page
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        await page.goto("http://localhost:8001", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(1000)
        await page.screenshot(path="static/overhaul/screenshots/after_desktop.png", full_page=True)
        print("✓ after_desktop.png")

        # 2. Desktop - Workshop types
        await page.click("text=Browse Workshops")
        await page.wait_for_timeout(500)
        await page.screenshot(path="static/overhaul/screenshots/after_workshops.png", full_page=True)
        print("✓ after_workshops.png")

        # 3. Desktop - Login
        await page.click("text=Sign In")
        await page.wait_for_timeout(500)
        await page.screenshot(path="static/overhaul/screenshots/after_login.png")
        print("✓ after_login.png")

        # 4. Desktop - Register
        await page.click("text=Create an account")
        await page.wait_for_timeout(500)
        await page.screenshot(path="static/overhaul/screenshots/after_register.png", full_page=True)
        print("✓ after_register.png")

        # 5. Desktop - Login and go to coordinator status
        await page.goto("http://localhost:8001", wait_until="networkidle")
        await page.click("text=Sign In")
        await page.wait_for_timeout(300)
        await page.fill("#username", "demo_coord")
        await page.fill("#password", "password123")
        await page.click("text=Sign In", strict=False)
        await page.wait_for_timeout(500)
        await page.screenshot(path="static/overhaul/screenshots/after_status.png", full_page=True)
        print("✓ after_status.png")

        # 6. Mobile - Home page
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            is_mobile=True,
            has_touch=True,
        )
        m = await context.new_page()
        await m.goto("http://localhost:8001", wait_until="networkidle", timeout=15000)
        await m.wait_for_timeout(1000)
        await m.screenshot(path="static/overhaul/screenshots/after_mobile_home.png", full_page=True)
        print("✓ after_mobile_home.png")

        # 7. Mobile - menu open
        await m.click(".hamburger")
        await m.wait_for_timeout(400)
        await m.screenshot(path="static/overhaul/screenshots/after_mobile_menu.png")
        print("✓ after_mobile_menu.png")

        # 8. Before - Original Django (if running)
        try:
            p2 = await browser.new_page(viewport={"width": 1280, "height": 800})
            await p2.goto("http://localhost:8002", wait_until="networkidle", timeout=5000)
            await p2.screenshot(path="static/overhaul/screenshots/before_desktop.png", full_page=True)
            print("✓ before_desktop.png (from Django)")
        except Exception as e:
            print(f"⚠ Django not running, skipping before screenshot: {e}")

        await browser.close()
        print("\nAll screenshots captured!")

if __name__ == "__main__":
    asyncio.run(main())
