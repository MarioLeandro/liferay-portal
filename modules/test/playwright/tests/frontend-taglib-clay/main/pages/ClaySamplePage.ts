/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

import POM from '../../../../utils/POM';
import {clickAndExpectToBeVisible} from '../../../../utils/clickAndExpectToBeVisible';

export enum TabName {
	ALERTS = 'Alerts',
	BADGES = 'Badges',
	BUTTONS = 'Buttons',
	CARDS = 'Cards',
	DROPDOWNS = 'Dropdowns',
	FORM_ELEMENTS = 'Form Elements',
	ICONS = 'Icons',
	LABELS = 'Labels',
	LINKS = 'Links',
	MANAGEMENT_TOOLBARS = 'Management Toolbars',
	NAVIGATION_BARS = 'Navigation Bars',
	PAGINATION_BARS = 'Pagination Bars',
	PANEL = 'Panel',
	PROGRESS_BARS = 'Progress Bars',
	STICKERS = 'Stickers',
	TABS = 'Tabs',
	TOGGLE = 'Toggle',
	VERTICAL_NAV = 'Vertical Nav',
}

interface AlertLocatorsBase {
	icon: (icon: string) => Locator;
	lead: (leadText: string) => Locator;
	locator: Locator;
}

export interface StripeAlertLocators extends AlertLocatorsBase {
	close: Locator;
}

export class ClaySamplePage extends POM {
	readonly alert: (
		type: 'embedded' | 'stripe',
		variant: string
	) => AlertLocatorsBase | StripeAlertLocators;

	readonly alertSuccessSubmit: {
		closeButton: Locator;
		locator: Locator;
		trigger: Locator;
	};
	readonly alertDisappearsAfterFiveSeconds: {
		locator: Locator;
		trigger: Locator;
	};
	readonly managementToolbarActiveState: Locator;
	readonly managementToolbarDefaultState: Locator;
	readonly managementToolbarUsingDisplayContext: Locator;
	readonly managementToolbarWithResultsBar: Locator;
	readonly tablist: Locator;
	readonly tooltip: Locator;

	constructor(page: Page, url: string) {
		super(page, url);

		this.alert = (type: 'embedded' | 'stripe', variant: string) => {
			const fluidClass = type === 'stripe' ? '.alert-fluid' : '';

			const alertLocators: AlertLocatorsBase = {
				icon: (icon) =>
					this.page
						.locator(`.alert${fluidClass}.alert-${variant}`)
						.locator(`.lexicon-icon.lexicon-icon-${icon}`),
				lead: (leadText) =>
					this.page
						.locator(`.alert${fluidClass}.alert-${variant}`)
						.locator('.lead')
						.getByText(leadText),
				locator: this.page.locator(
					`.alert${fluidClass}.alert-${variant}`
				),
			};

			if (type === 'stripe') {
				return {
					...alertLocators,
					close: this.page.locator('.alert-close-button'),
				} as StripeAlertLocators;
			}

			return alertLocators;
		};

		this.alertSuccessSubmit = {
			closeButton: page
				.locator('.alert-notifications')
				.locator('.alert.alert-success')
				.locator('.close'),
			locator: page.getByText(
				'Success:Your request completed successfully.'
			),
			trigger: page.getByText('Success Submit'),
		};

		this.alertDisappearsAfterFiveSeconds = {
			locator: page.getByText(
				'Info:Your request completed successfully.'
			),
			trigger: page.getByText('Disappears After 5 Seconds'),
		};

		this.managementToolbarActiveState = page.locator(
			'#managementToolbarActiveState'
		);
		this.managementToolbarDefaultState = page.locator(
			'#managementToolbarDefaultState'
		);
		this.managementToolbarUsingDisplayContext = page.locator(
			'#managementToolbarUsingDisplayContext'
		);
		this.managementToolbarWithResultsBar = page.locator(
			'#managementToolbarWithResultsBar'
		);
		this.tablist = page.getByRole('tablist');
		this.tooltip = page.locator('.tooltip-inner');
	}

	async selectTab(tabName: TabName) {
		const tabHeading = this.tablist.getByText(tabName);

		const target: Locator | undefined = {
			[TabName.ALERTS]: this.page.getByRole('heading', {
				name: 'EMBEDDED',
			}),

			[TabName.BADGES]: this.page.getByText('Primary'),

			[TabName.BUTTONS]: this.page.getByRole('heading', {name: 'TYPES'}),

			[TabName.CARDS]: this.page.getByRole('heading', {
				name: 'Image Cards',
			}),

			[TabName.DROPDOWNS]: this.page.getByRole('heading', {
				name: 'DROPDOWN MENU',
			}),

			[TabName.FORM_ELEMENTS]: this.page.getByRole('heading', {
				name: 'CHECKBOX',
			}),

			[TabName.ICONS]: this.page.getByRole('heading', {
				name: 'Liferay Icon Library',
			}),

			[TabName.LABELS]: this.page.getByRole('heading', {
				name: 'LABEL REMOVABLE',
			}),

			[TabName.LINKS]: this.page.getByRole('heading', {
				name: 'SINGLE LINK',
			}),

			[TabName.MANAGEMENT_TOOLBARS]: this.page.getByRole('heading', {
				name: 'DEFAULT STATE',
			}),

			[TabName.NAVIGATION_BARS]: this.page.getByRole('heading', {
				name: 'NAVIGATION BARS USING DISPLAY CONTEXT',
			}),

			[TabName.PAGINATION_BARS]: this.page.getByRole('heading', {
				name: 'Default',
			}),

			[TabName.PANEL]: this.page.getByRole('heading', {
				name: 'DEFAULT PANEL',
			}),

			[TabName.PROGRESS_BARS]: this.page.getByText(
				'Progress bar is a progress indicator used to show the completion percentage of a task.'
			),

			[TabName.STICKERS]: this.page.getByRole('heading', {
				name: 'SQUARE',
			}),

			[TabName.TABS]: this.page.getByRole('heading', {
				name: 'DEFAULT TABS',
			}),

			[TabName.TOGGLE]: this.page.getByRole('heading', {
				name: 'DEFAULT TOGGLE',
			}),

			[TabName.VERTICAL_NAV]: this.page.getByRole('heading', {
				name: 'DEFAULT VERTICAL NAV',
			}),
		}[tabName];

		if (target === undefined) {
			throw new Error(`Unknown tab name ${tabName}`);
		}

		await clickAndExpectToBeVisible({
			autoClick: true,
			target,
			trigger: tabHeading,
		});
	}

	override async waitFor() {
		await this.page
			.getByRole('heading', {name: 'EMBEDDED'})
			.waitFor({state: 'visible'});
	}
}
