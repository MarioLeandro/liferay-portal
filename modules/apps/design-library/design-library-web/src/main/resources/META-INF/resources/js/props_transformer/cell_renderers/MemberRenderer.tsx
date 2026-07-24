/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import ClaySticker from '@clayui/sticker';
import React from 'react';

const MemberRenderer = ({
	itemData,
	ownerId,
	value,
}: {
	itemData: {
		id: number;
		image?: string;
		numberOfUserAccounts?: number;
		roles?: Array<{name: string}>;
	};
	ownerId?: string;
	value: string;
}) => {
	if (itemData.numberOfUserAccounts !== undefined) {
		return (
			<span className="align-items-center d-flex">
				<ClaySticker
					className="c-mr-2"
					displayType="secondary"
					shape="circle"
					size="lg"
				>
					<ClayIcon symbol="users" />
				</ClaySticker>

				{value}

				<span className="ml-1">
					(
					{Liferay.Util.sub(
						Liferay.Language.get('x-members'),
						itemData.numberOfUserAccounts
					)}
					)
				</span>
			</span>
		);
	}

	const roles = itemData.roles || [];

	const isOwner =
		(ownerId !== undefined && String(itemData.id) === String(ownerId)) ||
		roles.some((role) => role.name === 'Design Library Owner');

	return (
		<span className="align-items-center d-flex">
			<ClaySticker
				className="c-mr-2"
				displayType="secondary"
				shape="circle"
				size="lg"
			>
				<ClaySticker.Image
					alt={value}
					src={
						itemData.image ||
						`${Liferay.ThemeDisplay.getPathContext() || ''}/image/user_portrait`
					}
				/>
			</ClaySticker>

			{value}

			{isOwner && (
				<span className="ml-1">({Liferay.Language.get('owner')})</span>
			)}
		</span>
	);
};

export default MemberRenderer;
