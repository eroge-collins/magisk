import { test, expect } from '@playwright/test'

test.describe('Magisk - Smoke Tests', () => {
  test('login page loads with correct elements', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/login')
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('text=Criar conta')).toBeVisible()

    expect(errors).toHaveLength(0)
  })

  test('register page loads with correct elements', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/register')
    await expect(page.locator('input#display_name')).toBeVisible()
    await expect(page.locator('input#username')).toBeVisible()
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    await expect(page.locator('input#confirmPassword')).toBeVisible()

    expect(errors).toHaveLength(0)
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login validation shows errors for empty fields', async ({ page }) => {
    await page.goto('/login')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Email invalido')).toBeVisible()
    await expect(page.locator('text=Senha deve ter no minimo 6 caracteres')).toBeVisible()
  })

  test('register validation shows errors for mismatched passwords', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input#email', 'test@test.com')
    await page.fill('input#display_name', 'Test User')
    await page.fill('input#username', 'testuser')
    await page.fill('input#password', '123456')
    await page.fill('input#confirmPassword', 'different')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Senhas nao conferem')).toBeVisible()
  })

  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/thispagedoesnotexist')
    await expect(page.locator('text=404')).toBeVisible()
    await expect(page.locator('text=Pagina nao encontrada')).toBeVisible()
  })

  test('login with valid credentials redirects to feed', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input#email', 'testemagisk@teste.com')
    await page.fill('input#password', 'teste123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/', { timeout: 10000 })
  })

  test('feed page shows create post area after login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input#email', 'testemagisk@teste.com')
    await page.fill('input#password', 'teste123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/', { timeout: 10000 })
    await expect(page.locator('text=Compartilhe algo mistico')).toBeVisible({ timeout: 5000 })
  })
})
