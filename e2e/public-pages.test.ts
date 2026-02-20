import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
	test('displays main heading and hero content', async ({ page }) => {
		await page.goto('/');

		// Check that main heading exists
		await expect(page.locator('h1')).toBeVisible();

		// Check for Get Started and Login buttons in main content area
		await expect(
			page
				.getByRole('main')
				.getByRole('link', { name: /get started/i })
				.first()
		).toBeVisible();
		await expect(
			page
				.getByRole('main')
				.getByRole('link', { name: /have.*account|log in/i })
				.first()
		).toBeVisible();
	});

	test('navigates to register page from Get Started button', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('main')
			.getByRole('link', { name: /get started/i })
			.first()
			.click();
		await expect(page).toHaveURL('/register');
	});

	test('navigates to login page', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('main')
			.getByRole('link', { name: /have.*account|log in/i })
			.first()
			.click();
		await expect(page).toHaveURL('/login');
	});

	test('displays features section', async ({ page }) => {
		await page.goto('/');

		// Check for feature cards with emojis
		await expect(page.getByText('🎮')).toBeVisible();
		await expect(page.getByText('🎤')).toBeVisible();
		await expect(page.getByText('🤖')).toBeVisible();
	});

	test('displays CEFR levels', async ({ page }) => {
		await page.goto('/');

		// Check for CEFR level badges
		for (const level of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
			await expect(page.getByText(level, { exact: true }).first()).toBeVisible();
		}
	});
});

test.describe('Login page', () => {
	test('displays login form', async ({ page }) => {
		await page.goto('/login');

		await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
	});

	test('has link to register page', async ({ page }) => {
		await page.goto('/login');

		const signUpLink = page.getByRole('link', { name: /sign up/i });
		await expect(signUpLink).toBeVisible();
		await signUpLink.click();
		await expect(page).toHaveURL('/register');
	});

	test('requires email and password fields', async ({ page }) => {
		await page.goto('/login');

		const emailInput = page.getByLabel(/email/i);
		const passwordInput = page.getByLabel(/password/i);

		await expect(emailInput).toHaveAttribute('required', '');
		await expect(passwordInput).toHaveAttribute('required', '');
	});

	test('has correct page title', async ({ page }) => {
		await page.goto('/login');
		await expect(page).toHaveTitle(/log in.*openlingo/i);
	});
});

test.describe('Register page', () => {
	test('displays registration form', async ({ page }) => {
		await page.goto('/register');

		await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
		await expect(page.getByLabel(/display name/i)).toBeVisible();
		await expect(page.getByLabel(/^email$/i)).toBeVisible();
		await expect(page.getByLabel(/^password$/i)).toBeVisible();
		await expect(page.getByLabel(/confirm password/i)).toBeVisible();
	});

	test('has link to login page', async ({ page }) => {
		await page.goto('/register');

		const loginLink = page.getByRole('main').getByRole('link', { name: /log in/i });
		await expect(loginLink).toBeVisible();
		await loginLink.click();
		await expect(page).toHaveURL('/login');
	});

	test('password requires minimum 8 characters', async ({ page }) => {
		await page.goto('/register');

		const passwordInput = page.getByLabel(/^password$/i);
		await expect(passwordInput).toHaveAttribute('minlength', '8');
	});

	test('displays password hint', async ({ page }) => {
		await page.goto('/register');

		await expect(page.getByText(/must be at least 8 characters/i)).toBeVisible();
	});

	test('has correct page title', async ({ page }) => {
		await page.goto('/register');
		await expect(page).toHaveTitle(/sign up.*openlingo/i);
	});
});

test.describe('Navigation', () => {
	test('404 page displays for non-existent routes', async ({ page }) => {
		const response = await page.goto('/non-existent-page');
		expect(response?.status()).toBe(404);
	});
});
