/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayModal from '@clayui/modal';
import {ItemSelector} from '@liferay/frontend-js-item-selector-web';
import {ManageMembersModal, openModal} from 'frontend-js-components-web';
import {fetch} from 'frontend-js-web';
import React, {useCallback, useEffect, useState} from 'react';

import DesignLibraryAddMembersInput from './DesignLibraryAddMembersInput';
import {DESIGN_LIBRARY_MEMBERS_CONFIG} from './designLibraryMembersConfig';

interface Site {
	descriptiveName?: string;
	externalReferenceCode?: string;
	id?: number | string;
	name?: string;
}

interface DesignLibrarySectionHeaderProps {
	connectedSitesAPIURL?: string;
	count?: number;
	externalReferenceCode?: string;
	hasAssignMembersPermission?: boolean;
	ownerId?: string;
	section: 'connected-sites' | 'members';
	title: string;
	viewAllLabel: string;
}

function ConnectedSitesModalContent({
	apiURL,
	externalReferenceCode,
}: {
	apiURL: string;
	externalReferenceCode: string;
}) {
	const [sites, setSites] = useState<Site[]>([]);
	const [value, setValue] = useState('');

	const load = useCallback(() => {
		fetch(apiURL, {headers: {Accept: 'application/json'}})
			.then((response) => response.json())
			.then((data) => setSites(data?.items ?? []))
			.catch(() => setSites([]));
	}, [apiURL]);

	useEffect(() => {
		load();
	}, [load]);

	const connectSite = (siteExternalReferenceCode?: string) => {
		if (!siteExternalReferenceCode) {
			return;
		}

		fetch(
			`/o/headless-asset-library/v1.0/asset-libraries/${externalReferenceCode}/connected-sites/${siteExternalReferenceCode}`,
			{
				body: JSON.stringify({searchable: true}),
				headers: {'Content-Type': 'application/json'},
				method: 'PUT',
			}
		)
			.then(() => {
				setValue('');
				load();
			})
			.catch(() => {});
	};

	return (
		<div>
			<ClayModal.Header>
				{Liferay.Language.get('connected-sites')}
			</ClayModal.Header>

			<ClayModal.Body>
				<label>{Liferay.Language.get('connect-sites')}</label>

				<ItemSelector<Site>
					apiURL={`${location.origin}/o/headless-admin-site/v1.0/sites?active=true`}
					id="designLibrarySitesAutocomplete"
					locator={{id: 'id', label: 'name', value: 'id'}}
					onChange={setValue}
					placeholder={Liferay.Language.get('select-a-site')}
					value={value}
				>
					{(site: Site) => (
						<ItemSelector.Item
							key={site.id}
							onClick={() =>
								connectSite(site.externalReferenceCode)
							}
							textValue={site.name ?? ''}
						>
							{site.name ?? site.descriptiveName ?? '-'}
						</ItemSelector.Item>
					)}
				</ItemSelector>

				<h4 className="mt-4">
					{Liferay.Language.get('connected-sites')}
				</h4>

				{sites.length ? (
					<ul className="list-group list-group-flush">
						{sites.map((site, index) => (
							<li className="list-group-item px-0" key={index}>
								{site.name ?? site.descriptiveName ?? '-'}
							</li>
						))}
					</ul>
				) : (
					<p className="text-secondary">
						{Liferay.Language.get('no-connected-sites-yet')}
					</p>
				)}
			</ClayModal.Body>
		</div>
	);
}

export default function DesignLibrarySectionHeader({
	connectedSitesAPIURL = '',
	count,
	externalReferenceCode = '',
	hasAssignMembersPermission = false,
	ownerId,
	section,
	title,
	viewAllLabel,
}: DesignLibrarySectionHeaderProps) {
	const openViewAll = () => {
		if (section === 'members') {
			openModal({
				contentComponent: () => (
					<ManageMembersModal
						config={DESIGN_LIBRARY_MEMBERS_CONFIG}
						emptyStateDescription={Liferay.Language.get(
							'add-members-to-this-design-library'
						)}
						externalReferenceCode={externalReferenceCode}
						hasAssignMembersPermission={hasAssignMembersPermission}
						headerTitle={Liferay.Language.get('members')}
						ownerId={ownerId}
						renderAddMembersInput={(api) => (
							<DesignLibraryAddMembersInput {...api} />
						)}
					/>
				),
				size: 'md',
			});
		}
		else {
			openModal({
				contentComponent: () => (
					<ConnectedSitesModalContent
						apiURL={connectedSitesAPIURL}
						externalReferenceCode={externalReferenceCode}
					/>
				),
				size: 'md',
			});
		}
	};

	return (
		<div className="align-items-center d-flex justify-content-between mb-3">
			<h2 className="font-weight-semi-bold h4 m-0">
				{title}

				{typeof count === 'number' ? ` (${count})` : ''}
			</h2>

			<ClayButton
				className="font-weight-semi-bold text-3"
				displayType="link"
				onClick={openViewAll}
			>
				{viewAllLabel}
			</ClayButton>
		</div>
	);
}
