/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLayout from '@clayui/layout';
import React from 'react';

import CategoryCard from './CategoryCard';
import HomePageLayout from './HomePageLayout';
import { CategoryItem, HomeProps } from './types';


const ApplicationsHome = ({ categories = [], homeTitle, homeLogo }: HomeProps) => {
    return (
        <HomePageLayout homeLogo={homeLogo} homeTitle={homeTitle} homeTitleCentralized>
            {(categories as Array<CategoryItem>).map((item) => (
                <ClayLayout.Col className="mb-4" key={item.id} md={3} sm={6}>
                    <CategoryCard item={item} />
                </ClayLayout.Col>
            ))}
        </HomePageLayout>
    );
};

export default ApplicationsHome;
