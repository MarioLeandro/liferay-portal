/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLayout from '@clayui/layout';
import React from 'react';

import CategoryCardSmall from './CategoryCardSmall';
import HomePageLayout from './HomePageLayout';
import { CategoryItemGrouped, HomeProps } from './types';

const CommerceHome = ({ categories = [], homeTitle, homeLogo, homeTitleColor }: HomeProps) => {
    return (
        <HomePageLayout homeLogo={homeLogo} homeTitle={homeTitle} homeTitleCentralized homeTitleColor={homeTitleColor}>
            {(categories as Array<CategoryItemGrouped>).map((group) => (
                <section className="mb-4 w-100" key={group.label}>
                    <div className="mb-2 pb-2 row">
                        <div className="col-12">
                            <h3 className="font-weight-bold mb-0 text-4 text-capitalize text-secondary">
                                {group.label}
                            </h3>
                        </div>
                    </div>

                    <ClayLayout.Row>
                        {group.panelApps.map((app) => (
                            <ClayLayout.Col className="mb-3" key={app.id} md={4} sm={6}>
                                <CategoryCardSmall item={app} />
                            </ClayLayout.Col>
                        ))}
                    </ClayLayout.Row>
                </section>
            ))}
        </HomePageLayout>
    );
};
export default CommerceHome;
