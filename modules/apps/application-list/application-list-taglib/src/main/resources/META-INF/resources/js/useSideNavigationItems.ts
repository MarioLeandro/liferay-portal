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
	panelAppNavigationItemsMap: PanelAppNavigationItemsMap
): Array<SideNavigationItem> {
	const mergedItems = items.map((item) => {
		const panelAppNavigationItems = panelAppNavigationItemsMap[item.id];

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
				panelAppNavigationItemsMap
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
	navigationItemsUrl: string
) {
	const [loading, setLoading] = useState(false);
	const [panelAppNavigationItemsMap, setPanelAppNavigationItemsMap] =
		useState<PanelAppNavigationItemsMap>();

	const promiseRef = useRef<Promise<void>>();

	const fetchNavigationItems = useCallback(() => {
		if (promiseRef.current) {
			return;
		}

		setLoading(true);

		promiseRef.current = fetch(navigationItemsUrl)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`Unable to load the navigation items: ${response.statusText}`
					);
				}

				return response.json();
			})
			.then((responseJSON) =>
				setPanelAppNavigationItemsMap(
					responseJSON.navigationItems ?? {}
				)
			)
			.catch((error) => {
				promiseRef.current = undefined;

				// eslint-disable-next-line no-console
				console.error(error);
			})
			.finally(() => setLoading(false));
	}, [navigationItemsUrl]);

	const mergedItems = useMemo(
		() =>
			panelAppNavigationItemsMap
				? mergeNavigationItems(items, panelAppNavigationItemsMap)
				: items,
		[items, panelAppNavigationItemsMap]
	);

	return {fetchNavigationItems, loading, mergedItems};
}
