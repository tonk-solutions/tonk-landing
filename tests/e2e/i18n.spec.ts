import { test, expect } from '@playwright/test';

test.describe('Spanish locale (es)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es');
  });

  test('footer uses voseo', async ({ page }) => {
    const footer = page.locator('footer');

    await expect(footer.getByText('Seguinos', { exact: true })).toBeVisible();
    await expect(footer.getByText('Síguenos', { exact: true })).toHaveCount(0);
  });

  test('services section is localized', async ({ page }) => {
    const servicesSection = page.locator('#servicios');
    const branchGroup = servicesSection.getByRole('radiogroup');

    await expect(
      servicesSection.getByText('Nuestros Servicios', { exact: true }).filter({ visible: true }),
    ).toBeVisible();

    await expect(branchGroup.getByText('Craft', { exact: true })).toBeVisible();
    await expect(branchGroup.getByText('Desarrollo de software', { exact: true })).toBeVisible();
    await expect(branchGroup.getByText('Talent', { exact: true })).toBeVisible();
    await expect(branchGroup.getByText('Talento IT', { exact: true })).toBeVisible();
  });
});

test.describe('English locale (en)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('services section is in English and does not leak Spanish copy', async ({ page }) => {
    const servicesSection = page.locator('#servicios');
    const branchGroup = servicesSection.getByRole('radiogroup');

    await expect(
      servicesSection.getByText('Our Services', { exact: true }).filter({ visible: true }),
    ).toBeVisible();
    await expect(page.getByText('Nuestros Servicios', { exact: true })).toHaveCount(0);

    await expect(branchGroup.getByText('Software development', { exact: true })).toBeVisible();
    await expect(branchGroup.getByText('Tech talent', { exact: true })).toBeVisible();
  });
});
