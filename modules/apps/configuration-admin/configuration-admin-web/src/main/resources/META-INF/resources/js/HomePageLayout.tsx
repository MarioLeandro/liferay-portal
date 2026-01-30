/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLayout from '@clayui/layout';
import ClaySticker, { DisplayType } from '@clayui/sticker'

// eslint-disable-next-line @liferay/imports-first
import React from 'react';


type Props = {
    children: React.ReactNode;
    homeLogo?: string;
    homeTitle: string;
    homeTitleCentralized?: boolean;
    homeTitleColor?: DisplayType;
};

const HomePageLayout = ({ children, homeLogo, homeTitle, homeTitleCentralized = false, homeTitleColor }: Props) => {
    return (
        <ClayLayout.ContainerFluid view>
             <ClayLayout.Row className="mb-5">
                <ClayLayout.Col>
                {homeTitleCentralized ? (
                    <div className="py-4 text-center">
                    <div className="mb-3">
                        <ClaySticker
                        className="border-0 mr-1"
                        displayType={homeTitleColor}
                        size="xxl"
                        >
                        {homeLogo && (
                            <img
                            alt={`${homeTitle} logo`}
                            src={homeLogo}
                            style={{ height: "44px", width: "44px" }}
                            />
                        )}
                        </ClaySticker>
                    </div>

                    <span className="font-family-sans-serif font-weight-bold text-9 text-dark text-truncate">
                        {homeTitle}
                    </span>
                    </div>
                ) : (
                    <div className="c-gap-3 d-flex py-4 text-left">
                    {homeLogo && (
                        <img
                        alt={`${homeTitle} logo`}
                        src={homeLogo}
                        style={{ height: "44px", width: "44px" }}
                        />
                    )}

                    <span className="font-family-sans-serif font-weight-bold text-9 text-dark text-truncate">
                        {homeTitle}
                    </span>
                    </div>
                )}
                </ClayLayout.Col>
             </ClayLayout.Row>

            <ClayLayout.Row>
                {children}
            </ClayLayout.Row>
        </ClayLayout.ContainerFluid>
    );
};

export default HomePageLayout;
