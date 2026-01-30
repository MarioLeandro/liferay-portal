/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayCard from '@clayui/card';
import ClayIcon from '@clayui/icon';
import ClaySticker from '@clayui/sticker';
import React from 'react';

import { CategoryItem } from './types';



interface Props {
    item: CategoryItem;
}

const CategoryCardSmall = ({ item }: Props) => {
    return (
        <ClayCard className="mb-0" href={item.url} interactive>
            <ClayCard.Body className="align-items-center d-flex px-3 py-2">
                    <ClaySticker 
                        className="border-0 mr-3" 
                        displayType={item.color || 'unstyled'} 
                        size="lg"
                    >
                        <ClayIcon
                            spritemap={Liferay.Icons.spritemap}
                            symbol={item.icon}
                        />
                    </ClaySticker>

                    <div className="flex-grow-1 text-truncate">
                        <span className="d-block font-weight-semi-bold text-3 text-dark text-truncate">
                            {item.label}
                        </span>
                    </div>
            </ClayCard.Body>
        </ClayCard>
    );
};

export default CategoryCardSmall;