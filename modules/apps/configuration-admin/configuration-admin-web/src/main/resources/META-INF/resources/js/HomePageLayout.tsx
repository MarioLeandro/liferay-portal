/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import ClaySticker from '@clayui/sticker'

// eslint-disable-next-line @liferay/imports-first
import classNames from 'classnames';

// eslint-disable-next-line @liferay/imports-first
import React from 'react';

// eslint-disable-next-line @liferay/imports-first
import { useWindowSize } from './utils/useWindowSize';


type Props = {
    children: React.ReactNode;
    homeLogo?: string;
    homeTitle: string;
    homeTitleCentralized?: boolean;
};

const LARGE_BREAKPOINT = 992;

const HomePageLayout = ({ children, homeLogo, homeTitle, homeTitleCentralized = false }: Props) => {
    const {width} = useWindowSize();

    const isLargeBreakpoint = width >= LARGE_BREAKPOINT;

    return (
        <ClayLayout.ContainerFluid className='px-2 px-md-3 px-sm-2 px-xl-4' view>
             <ClayLayout.Row className="my-5">
                <ClayLayout.Col>
                    <div 
                        className={
                            classNames('font-family-source-sans-pro font-weight-bold text-truncate', {
                                'd-flex align-items-center text-left': !homeTitleCentralized,
                                'text-center': homeTitleCentralized,
                            })
                        }
                    >
                        <div className={classNames({
                            'mb-3': homeTitleCentralized,
                            'mr-3': !homeTitleCentralized
                        })}>
                            <ClaySticker
                                className="border-0"
                                displayType="outline-7"
                                size={isLargeBreakpoint ? "xxl" : "xl"}
                            >
                                {homeLogo && (
                                    <ClayIcon 
                                        style={isLargeBreakpoint ? {fontSize: 40} : {}} 
                                        symbol="plus-squares"
                                    />
                                )}
                            </ClaySticker>
                        </div>

                        <span className={classNames(
                                'font-family-source-sans-pro font-weight-bold text-truncate text-dark',
                                    {
                                        'text-7': !isLargeBreakpoint,
                                        'text-11': isLargeBreakpoint
                                    }
                            )}>
                            {homeTitle}
                        </span>
                    </div>
                
                </ClayLayout.Col>
             </ClayLayout.Row>

            <ClayLayout.Row className='mb-7'>
                {children}
            </ClayLayout.Row>
        </ClayLayout.ContainerFluid>
    );
};

export default HomePageLayout;
