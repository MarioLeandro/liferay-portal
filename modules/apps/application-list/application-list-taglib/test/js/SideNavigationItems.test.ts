/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {act, renderHook} from '@testing-library/react';
import {fetch} from 'frontend-js-web';

import {PanelAppNavigationItemsMap} from '../../src/main/resources/META-INF/resources/js/types/SideNavigation';
import {useSideNavigationItems} from '../../src/main/resources/META-INF/resources/js/useSideNavigationItems';

jest.mock('frontend-js-web', () => ({
	...(jest.requireActual('frontend-js-web') as any),
	fetch: jest.fn(),
}));

describe('Navigation items merging', () => {
	const dashboardItem = {
		href: 'dashboardHref',
		id: 'dashboard',
		label: 'Dashboard',
	};

	const categoryItems = [
		{
			id: 'content',
			items: [
				{href: 'assetsHref', id: 'assets', label: 'Assets'},
				dashboardItem,
			],
			label: 'Content',
		},
	];

	function renderNavigationItems() {
		return renderHook(() =>
			useSideNavigationItems(categoryItems, 'navigationItemsUrl')
		);
	}

	async function mergeNavigationItems(
		navigationItems: PanelAppNavigationItemsMap
	) {
		(fetch as jest.Mock).mockResolvedValue({
			json: () => Promise.resolve({navigationItems}),
			ok: true,
		});

		const {result} = renderNavigationItems();

		await act(async () => {
			result.current.fetchNavigationItems();
		});

		return result.current.mergedItems;
	}

	afterEach(() => {
		(fetch as jest.Mock).mockReset();
	});

	it('returns the same items before the screens are fetched', () => {
		const {result} = renderNavigationItems();

		expect(fetch).not.toHaveBeenCalled();
		expect(result.current.mergedItems).toBe(categoryItems);
	});

	it('returns the same items when the response is empty', async () => {
		expect(await mergeNavigationItems({})).toBe(categoryItems);
	});

	it('returns the same items when no application matches', async () => {
		expect(
			await mergeNavigationItems({
				unknownPortletId: [{href: 'href', label: 'Label'}],
			})
		).toBe(categoryItems);
	});

	it('returns the same items when the application has no screens', async () => {
		expect(await mergeNavigationItems({assets: []})).toBe(categoryItems);
	});

	it('merges the screens into the matching application', async () => {
		const mergedItems = await mergeNavigationItems({
			assets: [{href: 'categoriesHref', label: 'Categories'}],
		});

		expect(mergedItems).not.toBe(categoryItems);

		const applicationItems = mergedItems[0].items!;

		expect(applicationItems[0].items).toHaveLength(1);
		expect(applicationItems[0].items![0].label).toBe('Categories');
	});

	it('leaves the applications without screens untouched', async () => {
		const mergedItems = await mergeNavigationItems({
			assets: [{href: 'categoriesHref', label: 'Categories'}],
		});

		expect(mergedItems[0].items![1]).toBe(dashboardItem);
	});

	it('hides the merged screens from the tree and gives them an id', async () => {
		const mergedItems = await mergeNavigationItems({
			assets: [
				{href: 'categoriesHref', label: 'Categories'},
				{href: 'vocabulariesHref', label: 'Vocabularies'},
			],
		});

		const screenItems = mergedItems[0].items![0].items!;

		expect(screenItems[0].filterOnly).toBe(true);
		expect(screenItems[0].id).toBe('assets_0');
		expect(screenItems[1].id).toBe('assets_1');
	});

	it('keeps the canonical name and the parent label of a screen', async () => {
		const mergedItems = await mergeNavigationItems({
			assets: [
				{
					canonicalName: 'Beta',
					href: 'betaHref',
					label: 'Beta',
					parentLabel: 'Feature Flags',
				},
			],
		});

		const screenItem = mergedItems[0].items![0].items![0];

		expect(screenItem.canonicalName).toBe('Beta');
		expect(screenItem.parentLabel).toBe('Feature Flags');
	});
});
