/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {featureFlagsTest} from '../../../fixtures/featureFlagsTest';
import {clickAndExpectToBeHidden} from '../../../utils/clickAndExpectToBeHidden';
import {claySamplePageTest} from './fixtures/claySamplePageTest';
import {TabName} from './pages/ClaySamplePage';

const test = mergeTests(
	featureFlagsTest({
		'LPS-178052': {enabled: true},
	}),
	claySamplePageTest
);

test.beforeEach('Select alerts tab', async ({claySamplePage}) => {
	await claySamplePage.selectTab(TabName.ALERTS);
});

test.describe('Tests for ClayAlert', () => {
	test('Verify alert contains all required attributes: icon, type text, and description.', async ({
		claySamplePage,
	}) => {
		await test.step('Check if alert-success is present', async () => {
			await expect(
				claySamplePage.alert('embedded', 'success').locator.first()
			).toBeAttached();
		});

		await test.step('Check if alert-success displays the correct indicator icon', async () => {
			await expect(
				claySamplePage
					.alert('embedded', 'success')
					.icon('check-circle-full')
					.first()
			).toBeVisible();
		});

		await test.step('Check if alert-success displays the correct lead text', async () => {
			await expect(
				claySamplePage
					.alert('embedded', 'success')
					.lead('Success')
					.first()
			).toBeVisible();
		});

		await test.step('Check if the alert-success displays description text', async () => {
			await expect(
				claySamplePage.alert('embedded', 'success').locator.first()
			).toHaveText('Success:This is a success message.');
		});
	});

	test('Verify the keyword is semi-bold when alert contains status icon and keyword.', async ({
		claySamplePage,
	}) => {
		const successAlert = claySamplePage
			.alert('embedded', 'success')
			.locator.first();

		await expect(successAlert).toHaveCSS('font-weight', '400');

		await expect(successAlert.locator('.lead')).toHaveCSS(
			'font-weight',
			'600'
		);
	});

	test('Verify toast message popup can be closed manually.', async ({
		claySamplePage,
	}) => {
		const alertSuccessSubmit = claySamplePage.triggeredAlert(
			'Success:Your request completed successfully.',
			'Success Submit',
			'success'
		);
		await alertSuccessSubmit.trigger.click();

		await clickAndExpectToBeHidden({
			target: alertSuccessSubmit.locator,
			trigger: alertSuccessSubmit.close,
		});
	});

	test('Verify toast message popup will close automatically.', async ({
		claySamplePage,
		page,
	}) => {
		const alertDisappearsAfterFiveSeconds = claySamplePage.triggeredAlert(
			'Info:Your request completed successfully.',
			'Disappears After 5 Seconds',
			'info'
		);
		await alertDisappearsAfterFiveSeconds.trigger.click();

		await expect(alertDisappearsAfterFiveSeconds.locator).toBeVisible();

		await page.waitForTimeout(5000);

		await expect(alertDisappearsAfterFiveSeconds.locator).toBeHidden();
	});
});
