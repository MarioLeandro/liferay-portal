/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {IInternalRenderer} from '@liferay/frontend-data-set-web';
import React from 'react';

import AuthorRenderer from './cell_renderers/AuthorRenderer';
import TitleRenderer from './cell_renderers/TitleRenderer';

export default function DesignLibraryAdminFDSPropsTransformer(
	props: Record<string, unknown>
) {
	const creationMenu = {
		primaryItems: [
			{
				label: Liferay.Language.get('new-design-library'),
			},
		],
	};

	return {
		...props,
		creationMenu,
		customRenderers: {
			tableCell: [
				{
					component: AuthorRenderer,
					name: 'authorTableCellRenderer',
					type: 'internal',
				} as IInternalRenderer,
				{
					component: ({itemData, value}) =>
						TitleRenderer({
							href: 'baseURL_From_additionalProps' + itemData.id,
							value,
						}),
					name: 'titleTableCellRenderer',
					type: 'internal',
				} as IInternalRenderer,
			],
		},
		filters: [''],
		hideManagementBarInEmptyState: true,
		infoPanelComponent: () => <h1>{Liferay.Language.get('info-panel')}</h1>,
		snapshotsEnabled: true,
		sorts: [
			{
				active: false,
				default: false,
				direction: 'asc',
				key: 'name',
				label: Liferay.Language.get('title'),
			},
		],
		views: [
			{
				contentRenderer: 'table',
				default: true,
				label: 'Table',
				name: 'table',
				schema: {
					fields: [
						{
							contentRenderer: 'titleTableCellRenderer',
							fieldName: 'name',
							label: Liferay.Language.get('title'),
							localizeLabel: true,
							sortable: true,
						},
						{
							contentRenderer: 'authorTableCellRenderer',
							fieldName: 'creatorUserId',
							label: Liferay.Language.get('author'),
							localizeLabel: true,
							truncate: true,
						},
						{
							contentRenderer: 'dateTime',
							fieldName: 'dateModified',
							label: Liferay.Language.get('modified'),
							localizeLabel: true,
							sortable: true,
						},
					],
				},
				thumbnail: 'table',
			},
			{
				active: true,
				contentRenderer: 'cards',
				default: false,
				id: 'cards',
				label: 'Cards',
				name: 'cards',
				schema: {title: 'name'},
				template: 'cards',
				thumbnail: 'cards2',
			},
		],
	};
}
