/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fetch} from 'frontend-js-web';
import {useCallback, useMemo, useRef, useState} from 'react';

import {
	PanelAppNavigationItemsMap,
	SideNavigationItem,
} from './types/SideNavigation';

function mergeNavigationItems(
	items: Array<SideNavigationItem>,
	navigationItems: PanelAppNavigationItemsMap
): Array<SideNavigationItem> {
	const mergedItems = items.map((item) => {
		const panelAppNavigationItems = navigationItems[item.id];

		if (panelAppNavigationItems?.length) {
			return {
				...item,
				items: panelAppNavigationItems.map(
					(panelAppNavigationItem, index) => ({
						...panelAppNavigationItem,
						filterOnly: true,
						id: `${item.id}_${index}`,
					})
				),
			};
		}

		if (item.items) {
			const mergedChildItems = mergeNavigationItems(
				item.items,
				navigationItems
			);

			if (mergedChildItems !== item.items) {
				return {...item, items: mergedChildItems};
			}
		}

		return item;
	});

	if (mergedItems.every((mergedItem, index) => mergedItem === items[index])) {
		return items;
	}

	return mergedItems;
}

export function useSideNavigationItems(
	items: Array<SideNavigationItem>,
	navigationItemsURL: string
) {
	const [loading, setLoading] = useState(false);
	const [navigationItems, setNavigationItems] =
		useState<PanelAppNavigationItemsMap>();

	const promiseRef = useRef<Promise<void>>();

	const fetchNavigationItems = useCallback(() => {
		if (promiseRef.current) {
			return;
		}

		setLoading(true);

		promiseRef.current = fetch(navigationItemsURL)
			.then((response) => {
				if (!response.ok) {
					throw new Error(String(response.status));
				}

				return response.json();
			})
			.then((responseJSON) =>
				setNavigationItems(responseJSON.navigationItems ?? {})
			)
			.catch((error) => {

				// Leave the screens out of the tree rather than interrupting the
				// user. The filter still reaches the categories and the
				// applications, and the next focus tries again.

				promiseRef.current = undefined;

				// eslint-disable-next-line no-console
				console.error(error);
			})
			.finally(() => setLoading(false));
	}, [navigationItemsURL]);

	const mergedItems = useMemo(
		() =>
			navigationItems
				? mergeNavigationItems(items, navigationItems)
				: items,
		[items, navigationItems]
	);

	return {fetchNavigationItems, loading, mergedItems};
}
