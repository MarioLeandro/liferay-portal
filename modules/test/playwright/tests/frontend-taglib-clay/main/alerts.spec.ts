/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {featureFlagsTest} from '../../../fixtures/featureFlagsTest';
import {clickAndExpectToBeHidden} from '../../../utils/clickAndExpectToBeHidden';
import {claySamplePageTest} from './fixtures/claySamplePageTest';

const test = mergeTests(
	featureFlagsTest({
		'LPS-178052': {enabled: true},
	}),
	claySamplePageTest
);

test('Consolidated Tests for Clay Alerts', async ({claySamplePage, page}) => {
	const SUCCESS_MESSAGE = 'Success:This is a success message.';

	await test.step('ClayAlert: Check if alert-success is present', async () => {
		await expect(
			claySamplePage.alert(SUCCESS_MESSAGE).locator.first()
		).toBeAttached();
	});

	await test.step('ClayAlert: Check if alert-success displays the correct indicator icon', async () => {
		await expect(
			claySamplePage.alert(SUCCESS_MESSAGE).icon.first()
		).toBeVisible();
	});

	await test.step('ClayAlert: Check if alert-success displays the correct lead text', async () => {
		await expect(
			claySamplePage.alert(SUCCESS_MESSAGE).lead.first()
		).toBeVisible();
	});

	await test.step('ClayAlert: Check if the alert-success displays description text', async () => {
		await expect(
			claySamplePage.alert(SUCCESS_MESSAGE).locator.first()
		).toBeVisible();
	});

	await test.step('ClayAlert: Verify the keyword is semi-bold when alert contains status icon and keyword.', async () => {
		const successAlert = claySamplePage
			.alert(SUCCESS_MESSAGE)
			.locator.first();

		await expect(successAlert).toHaveCSS('font-weight', '400');

		await expect(successAlert.locator('.lead')).toHaveCSS(
			'font-weight',
			'600'
		);
	});

	await test.step('ClayAlert: Verify toast message popup can be closed manually.', async () => {
		const alertSuccessSubmit = claySamplePage.alert(
			'Success:Your request completed successfully.',
			'Success Submit'
		);
		await alertSuccessSubmit.trigger.click();

		await clickAndExpectToBeHidden({
			target: alertSuccessSubmit.locator,
			trigger: alertSuccessSubmit.close,
		});
	});

	await test.step('ClayAlert: Verify toast message popup will close automatically.', async () => {
		const alertDisappearsAfterFiveSeconds = claySamplePage.alert(
			'Info:Your request completed successfully.',
			'Disappears After 5 Seconds'
		);
		await alertDisappearsAfterFiveSeconds.trigger.click();

		await expect(alertDisappearsAfterFiveSeconds.locator).toBeVisible();

		await page.waitForTimeout(5000);

		await expect(alertDisappearsAfterFiveSeconds.locator).toBeHidden();
	});

	await test.step('ClayAlertStripe: Check if the stripe alert-success displays close button', async () => {
		await expect(claySamplePage.alert(SUCCESS_MESSAGE).close).toBeVisible();
	});
});
