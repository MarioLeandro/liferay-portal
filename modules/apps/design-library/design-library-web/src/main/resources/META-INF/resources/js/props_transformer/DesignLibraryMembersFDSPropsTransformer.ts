/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {IInternalRenderer} from '@liferay/frontend-data-set-web';

import {openManageMembersModal} from '../actions/breadcrumbActions';
import MemberRenderer from './cell_renderers/MemberRenderer';

interface MembersAdditionalProps {
	externalReferenceCode?: string;
	hasAssignMembersPermission?: boolean;
	ownerId?: string;
}

export default function DesignLibraryMembersFDSPropsTransformer(
	props: Record<string, unknown>
) {
	const {
		externalReferenceCode = '',
		hasAssignMembersPermission = false,
		ownerId = '',
	} = (props.additionalProps as MembersAdditionalProps) ?? {};

	return {
		...props,
		creationMenu: hasAssignMembersPermission
			? {
					primaryItems: [
						{
							label: Liferay.Language.get('add-members'),
							onClick: () =>
								openManageMembersModal({
									externalReferenceCode,
									hasAssignMembersPermission,
									headerTitle:
										Liferay.Language.get('manage-members'),
									ownerId,
								}),
						},
					],
				}
			: undefined,
		customRenderers: {
			tableCell: [
				{
					component: (rendererProps: {
						itemData: any;
						value: string;
					}) => MemberRenderer({...rendererProps, ownerId}),
					name: 'memberTableCellRenderer',
					type: 'internal',
				} as IInternalRenderer,
			],
		},
		hideManagementBarInEmptyState: true,
		views: [
			{
				contentRenderer: 'table',
				default: true,
				label: Liferay.Language.get('members'),
				name: 'table',
				schema: {
					fields: [
						{
							contentRenderer: 'memberTableCellRenderer',
							fieldName: 'name',
							label: Liferay.Language.get('members'),
							localizeLabel: true,
						},
					],
				},
				thumbnail: 'table',
			},
		],
	};
}
