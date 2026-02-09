/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayCard from '@clayui/card';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import ClaySticker from '@clayui/sticker';
import React from 'react';

import {CategoryItem} from './types';


const CategoryCardHorizontal = ({ 
    item: { 
        color = 'unstyled', 
        icon, 
        id, 
        label, 
        url 
    } 
}: { item: CategoryItem }) => {
	return (
		<ClayCard className="mb-3" horizontal href={url} interactive>
			<ClayCard.Body>
				<ClayCard.Row>
					<ClayLayout.ContentCol>
					<ClaySticker className="border-0"
						displayType={color}
						inline
					>
						<ClayIcon
							fontSize={16}
							symbol={icon}
						/>
					</ClaySticker>
				</ClayLayout.ContentCol>

				<ClayLayout.ContentCol expand>
					<ClayCard.Description
						className="text-4 text-dark"
						displayType="title"

						// aria-label={ariaLabel ?? title}
						// disabled={disabled}
						// href={href}

					>
						{label}
					</ClayCard.Description>
				</ClayLayout.ContentCol>
				</ClayCard.Row>
			</ClayCard.Body>
		</ClayCard>
	);
};

export default CategoryCardHorizontal;
