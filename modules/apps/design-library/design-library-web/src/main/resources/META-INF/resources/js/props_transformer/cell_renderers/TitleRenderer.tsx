/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import ClaySticker from '@clayui/sticker';
import React from 'react';

const TitleRenderer = ({href, value}: {href: string; value: string}) => {
	return (
		<span className="align-items-center d-flex list-group-title">
			<ClaySticker className="c-mr-2" displayType="outline-6">
				<ClayIcon symbol="books" />
			</ClaySticker>

			<ClayLink href={href}>{value}</ClayLink>
		</span>
	);
};

export default TitleRenderer;
