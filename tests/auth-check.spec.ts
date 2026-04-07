import { test, expect } from '@playwright/test'

test.describe('Auth Flow', () => {
  test('login and check feed page', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/login')
    await page.fill('input#email', 'testemagisk@teste.com')
    await page.fill('input#password', 'teste123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/', { timeout: 10000 })
    await expect(page.locator('text=Compartilhe algo mistico')).toBeVisible({ timeout: 5000 })

    expect(errors).toHaveLength(0)
  })
})
