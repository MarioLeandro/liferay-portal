/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClaySticker from '@clayui/sticker';
import {fetch} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

interface Item {
	descriptiveName?: string;
	emailAddress?: string;
	name?: string;
}

interface DesignLibrarySectionListProps {
	apiURL: string;
	showEmail?: boolean;
}

export default function DesignLibrarySectionList({
	apiURL,
	showEmail = false,
}: DesignLibrarySectionListProps) {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		fetch(apiURL, {headers: {Accept: 'application/json'}})
			.then((response) => response.json())
			.then((data) => {
				if (mounted) {
					setItems(data?.items ?? []);
				}
			})
			.catch(() => mounted && setItems([]))
			.finally(() => mounted && setLoading(false));

		return () => {
			mounted = false;
		};
	}, [apiURL]);

	if (loading) {
		return null;
	}

	if (!items.length) {
		return (
			<p className="text-secondary">
				{Liferay.Language.get('there-are-no-results')}
			</p>
		);
	}

	return (
		<ul className="list-group list-group-flush">
			{items.map((item, index) => {
				const label = item.name ?? item.descriptiveName ?? '-';

				return (
					<li
						className="align-items-center d-flex list-group-item px-0"
						key={index}
					>
						<ClaySticker
							className="mr-3"
							displayType="secondary"
							shape="circle"
							size="sm"
						>
							{label.charAt(0).toUpperCase()}
						</ClaySticker>

						<div>
							<div className="font-weight-semi-bold">{label}</div>

							{showEmail && item.emailAddress ? (
								<div className="text-3 text-secondary">
									{item.emailAddress}
								</div>
							) : null}
						</div>
					</li>
				);
			})}
		</ul>
	);
}
