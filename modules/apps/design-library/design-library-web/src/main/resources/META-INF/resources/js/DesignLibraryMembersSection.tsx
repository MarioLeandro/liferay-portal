/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fetch} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import DesignLibrarySectionHeader from './DesignLibrarySectionHeader';
import DesignLibrarySectionList from './DesignLibrarySectionList';

interface DesignLibraryMembersSectionProps {
	externalReferenceCode: string;
	hasAssignMembersPermission: boolean;
	ownerId: string;
	userAccountsAPIURL: string;
	userGroupsAPIURL: string;
}

export default function DesignLibraryMembersSection({
	externalReferenceCode,
	hasAssignMembersPermission,
	ownerId,
	userAccountsAPIURL,
	userGroupsAPIURL,
}: DesignLibraryMembersSectionProps) {
	const [activeTab, setActiveTab] = useState(0);
	const [count, setCount] = useState<number | undefined>();

	useEffect(() => {
		Promise.all([
			fetch(userAccountsAPIURL, {
				headers: {Accept: 'application/json'},
			}).then((response) => response.json()),
			fetch(userGroupsAPIURL, {
				headers: {Accept: 'application/json'},
			}).then((response) => response.json()),
		])
			.then(([users, groups]) =>
				setCount((users?.totalCount ?? 0) + (groups?.totalCount ?? 0))
			)
			.catch(() => {});
	}, [userAccountsAPIURL, userGroupsAPIURL]);

	return (
		<>
			<DesignLibrarySectionHeader
				count={count}
				externalReferenceCode={externalReferenceCode}
				hasAssignMembersPermission={hasAssignMembersPermission}
				ownerId={ownerId}
				section="members"
				title={Liferay.Language.get('members')}
				viewAllLabel={Liferay.Language.get('view-all-members')}
			/>

			<ul className="mb-3 nav nav-tabs">
				<li className="nav-item">
					<button
						className={`btn btn-unstyled nav-link ${
							activeTab === 0 ? 'active' : ''
						}`}
						onClick={() => setActiveTab(0)}
						type="button"
					>
						{Liferay.Language.get('users')}
					</button>
				</li>

				<li className="nav-item">
					<button
						className={`btn btn-unstyled nav-link ${
							activeTab === 1 ? 'active' : ''
						}`}
						onClick={() => setActiveTab(1)}
						type="button"
					>
						{Liferay.Language.get('user-groups')}
					</button>
				</li>
			</ul>

			{activeTab === 0 ? (
				<DesignLibrarySectionList
					apiURL={userAccountsAPIURL}
					showEmail
				/>
			) : (
				<DesignLibrarySectionList apiURL={userGroupsAPIURL} />
			)}
		</>
	);
}
