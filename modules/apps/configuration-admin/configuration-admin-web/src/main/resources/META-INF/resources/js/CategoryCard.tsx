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

const CategoryCard = ({ item }: Props) => {
    return (
        <ClayCard href={item.url} interactive>
            <ClayCard.Body>
                <div className="py-4 text-center">
                    <div className="mb-3">
                        <ClaySticker 
                            className="border-0 mr-1" 
                            displayType={item.color || 'unstyled'} 
                            size="xl"
                        >
                            <ClayIcon
                                spritemap={Liferay.Icons.spritemap}
                                symbol={item.icon}
                            />
                        </ClaySticker>
                    </div>

                    <ClayCard.Description 
                        className="font-family-sans-serif font-weight-semi-bold text-3 text-dark text-truncate" 
                        displayType="title"
                    >
                        {item.label}
                    </ClayCard.Description>
                </div>
            </ClayCard.Body>
        </ClayCard>
    );
};

export default CategoryCard;