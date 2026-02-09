/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLayout from '@clayui/layout';
import React from 'react';

import CategoryCardHorizontal from './CategoryCardHorizontal';
import HomePageLayout from './HomePageLayout';
import {CategoryItemGrouped, HomeProps} from './types';

const CommerceHome = ({
	categories = [],
	homeTitle,
	homeLogo,
}: HomeProps) => {
	return (
		<HomePageLayout
			homeLogo={homeLogo}
			homeTitle={homeTitle}
		>
			{(categories as Array<CategoryItemGrouped>).map((group) => (
				<ClayLayout.ContainerFluid className="mb-4" key={group.label}>

			<ClayLayout.ContentRow className="mb-2 pb-2">
				<ClayLayout.ContentCol expand>
					<h3 className="font-weight-semibold mb-0 text-3 text-secondary text-uppercase">
						{group.label}
					</h3>
				</ClayLayout.ContentCol>
			</ClayLayout.ContentRow>

				<ClayLayout.Row>
					{group.panelApps.map((app) => (
						<ClayLayout.Col
							key={app.id}
							md={4}
							sm={6} 
						>
							<CategoryCardHorizontal item={app} />
						</ClayLayout.Col>
					))}
				</ClayLayout.Row>
			</ClayLayout.ContainerFluid>
			))}
		</HomePageLayout>
	);
};
export default CommerceHome;
