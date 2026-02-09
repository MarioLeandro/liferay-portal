/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { DisplayType } from "@clayui/sticker";

export type CategoryItem = {
    color?: DisplayType;
    icon: string;
    id: string; 
    label: string;
    url: string; 
}

export type CategoryItemGrouped = {
    label: string;
    panelApps: Array<CategoryItem>
}

export type HomeProps = {
    categories: Array<CategoryItemGrouped | CategoryItem>;
    homeLogo?: string;
    homeTitle: string;
};
