/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom';
import {configure} from '@testing-library/dom';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {SideNavigation} from '../src/main/resources/META-INF/resources/js';

configure({
	testIdAttribute: 'data-qa-id',
});

const ITEMS = [
	{
		id: 'content',
		items: [
			{
				canonicalName: 'assetsCanonicalName',
				href: 'assetsHref',
				id: 'assets',
				items: [
					{
						canonicalName: 'categoriesCanonicalName',
						filterOnly: true,
						href: 'categoriesHref',
						id: 'categories',
						label: 'Categories',
					},
					{
						canonicalName: 'vocabulariesCanonicalName',
						filterOnly: true,
						href: 'vocabulariesHref',
						id: 'vocabularies',
						label: 'Vocabularies',
						parentLabel: 'Categories',
					},
				],
				label: 'Assets',
				leadingIcon: 'assetsIcon',
			},
			{
				canonicalName: 'dashboardCanonicalName',
				href: 'dashboardHref',
				id: 'dashboard',
				label: 'Dashboard',
				leadingIcon: 'dashboardIcon',
			},
		],
		label: 'Content',
	},
	{
		id: 'workflow',
		items: [
			{
				canonicalName: 'metricsCanonicalName',
				href: 'metricsHref',
				id: 'metrics',
				label: 'Metrics',
				leadingIcon: 'metricsIcon',
			},
		],
		label: 'Workflow',
	},
];

const renderComponent = ({expandedKeys = ['content', 'workflow']} = {}) =>
	render(
		<SideNavigation
			canonicalName="sideNavigationCanonicalName"
			categoryImageUrl="categoryImageUrl"
			colorScheme="light"
			colorSchemeSessionKey="colorSchemeSessionKey"
			expandedKeys={expandedKeys}
			expandedKeysSessionKey="expandedKeysSessionKey"
			items={ITEMS}
			label="Applications"
			selectedPortletId="assets"
			siteAdministrationItemSelectedEventName="siteAdministrationItemSelectedEventName"
			siteAdministrationItemSelectorUrl="siteAdministrationItemSelectorUrl"
			visible
			visibleSessionKey="visibleSessionKey"
		/>
	);

describe('SideNavigation', () => {

	// The shared Liferay mock exposes Session at its root rather than under
	// Util, which is where the portal puts it and where the panel reads it.

	beforeEach(() => {
		(Liferay.Util as Record<string, unknown>).Session = {
			set: jest.fn(() => Promise.resolve()),
		};
	});

	it('renders the side navigation with canonical name', () => {
		const {getByRole, getByTestId} = renderComponent();

		const sideNavigation = getByTestId('sideNavigation');

		expect(sideNavigation).toBeInTheDocument();
		expect(sideNavigation).toHaveAttribute(
			'data-canonical-name',
			'sideNavigationCanonicalName'
		);

		const assetsItem = getByRole('menuitem', {name: 'Assets'});

		expect(assetsItem.parentElement).toBeInTheDocument();
		expect(assetsItem.parentElement).toHaveAttribute(
			'data-canonical-name',
			'assetsCanonicalName'
		);
	});

	it('renders the side navigation header', () => {
		renderComponent();

		const title = screen.getByText('Applications');

		expect(title).toBeInTheDocument();

		const icon = screen.getByTestId('sideNavigationProductIcon');

		expect(icon).toHaveAttribute('src', 'categoryImageUrl');
	});

	it('renders each navigation item', () => {
		renderComponent();

		const menuItems = screen.getAllByRole('menuitem');

		expect(menuItems).toHaveLength(5);

		['Content', 'Workflow'].forEach((label) => {
			expect(screen.getByText(label)).toHaveAttribute(
				'aria-expanded',
				'true'
			);
		});

		['Assets', 'Dashboard', 'Metrics'].forEach((label) => {
			expect(screen.getByText(label)).toHaveAttribute(
				'href',
				`${label.toLowerCase()}Href`
			);
		});

		expect(screen.getByText('Assets')).toHaveClass('active');
		expect(screen.getByText('Workflow')).not.toHaveClass('active');
		expect(screen.getByText('Metrics')).not.toHaveClass('active');
	});

	it('shows only the navigation items from the expanded keys', () => {
		renderComponent({expandedKeys: ['workflow']});

		const menuItems = screen.getAllByRole('menuitem');

		expect(menuItems).toHaveLength(3);

		expect(screen.getByText('Content')).toHaveAttribute(
			'aria-expanded',
			'false'
		);

		expect(screen.getByText('Workflow')).toHaveAttribute(
			'aria-expanded',
			'true'
		);
	});

	it('hides the filter-only items until the query matches them', async () => {
		renderComponent();

		expect(screen.queryByText('Categories')).not.toBeInTheDocument();

		await userEvent.type(
			screen.getByTestId('sideNavigationSearchInput'),
			'categories'
		);

		const categoriesItem = await screen.findByText('Categories');

		expect(categoriesItem).toHaveAttribute('href', 'categoriesHref');
		expect(screen.getByText('Assets')).toBeInTheDocument();
		expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
	});

	it('keeps the filter-only items hidden when only their parent matches', async () => {
		renderComponent();

		await userEvent.type(
			screen.getByTestId('sideNavigationSearchInput'),
			'assets'
		);

		await waitFor(() =>
			expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
		);

		expect(screen.getByText('Assets')).toBeInTheDocument();
		expect(screen.queryByText('Categories')).not.toBeInTheDocument();
	});

	it('clears the query with the clear button and restores the tree', async () => {
		renderComponent();

		expect(
			screen.queryByTestId('sideNavigationClearSearchButton')
		).not.toBeInTheDocument();

		await userEvent.type(
			screen.getByTestId('sideNavigationSearchInput'),
			'categories'
		);

		await waitFor(() =>
			expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
		);

		await userEvent.click(
			screen.getByTestId('sideNavigationClearSearchButton')
		);

		await waitFor(() =>
			expect(screen.getByText('Dashboard')).toBeInTheDocument()
		);

		expect(screen.getByTestId('sideNavigationSearchInput')).toHaveValue('');
		expect(screen.queryByText('Categories')).not.toBeInTheDocument();
		expect(
			screen.queryByTestId('sideNavigationClearSearchButton')
		).not.toBeInTheDocument();
	});

	it('collapses a group while the filter is active without persisting it', async () => {
		renderComponent();

		await userEvent.type(
			screen.getByTestId('sideNavigationSearchInput'),
			'categories'
		);

		// Wait for the filter to reveal the match, so the click below lands
		// while the filter is genuinely active rather than during the debounce.

		await screen.findByText('Categories');

		const contentItem = screen.getByText('Content');

		expect(contentItem).toHaveAttribute('aria-expanded', 'true');

		(Liferay.Util.Session.set as jest.Mock).mockClear();

		await userEvent.click(contentItem);

		await waitFor(() =>
			expect(screen.getByText('Content')).toHaveAttribute(
				'aria-expanded',
				'false'
			)
		);

		await waitFor(() =>
			expect(screen.queryByText('Categories')).not.toBeInTheDocument()
		);

		expect(Liferay.Util.Session.set).not.toHaveBeenCalled();
	});

	it('discards a collapse made while filtering once the query changes', async () => {
		renderComponent();

		const searchInput = screen.getByTestId('sideNavigationSearchInput');

		await userEvent.type(searchInput, 'categories');

		await screen.findByText('Categories');

		await userEvent.click(screen.getByText('Content'));

		await waitFor(() =>
			expect(screen.getByText('Content')).toHaveAttribute(
				'aria-expanded',
				'false'
			)
		);

		// The collapse belongs to the results it was made against, so the next
		// query starts over from what the filter reveals.

		await userEvent.clear(searchInput);

		await userEvent.type(searchInput, 'vocabularies');

		await screen.findByText('Vocabularies');

		expect(screen.getByText('Content')).toHaveAttribute(
			'aria-expanded',
			'true'
		);
	});

	it('names the parent of a matching item that is nested below a screen', async () => {
		(Liferay.Language.get as jest.Mock).mockImplementation((key: string) =>
			key === 'in-x' ? 'in {0}' : key
		);

		renderComponent();

		await userEvent.type(
			screen.getByTestId('sideNavigationSearchInput'),
			'vocabularies'
		);

		const vocabulariesItem = await screen.findByText('Vocabularies');

		expect(vocabulariesItem).toHaveAttribute('href', 'vocabulariesHref');
		expect(screen.getByText('in Categories')).toBeInTheDocument();
		expect(screen.queryByText('Categories')).not.toBeInTheDocument();
	});
});
