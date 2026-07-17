/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fetch} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import DesignLibrarySectionHeader from './DesignLibrarySectionHeader';
import DesignLibrarySectionList from './DesignLibrarySectionList';

interface DesignLibraryConnectedSitesSectionProps {
	connectedSitesAPIURL: string;
	externalReferenceCode: string;
}

export default function DesignLibraryConnectedSitesSection({
	connectedSitesAPIURL,
	externalReferenceCode,
}: DesignLibraryConnectedSitesSectionProps) {
	const [count, setCount] = useState<number | undefined>();

	useEffect(() => {
		fetch(connectedSitesAPIURL, {headers: {Accept: 'application/json'}})
			.then((response) => response.json())
			.then((data) => setCount(data?.totalCount ?? 0))
			.catch(() => {});
	}, [connectedSitesAPIURL]);

	return (
		<>
			<DesignLibrarySectionHeader
				connectedSitesAPIURL={connectedSitesAPIURL}
				count={count}
				externalReferenceCode={externalReferenceCode}
				section="connected-sites"
				title={Liferay.Language.get('connected-sites')}
				viewAllLabel={Liferay.Language.get('view-all-sites')}
			/>

			<DesignLibrarySectionList apiURL={connectedSitesAPIURL} />
		</>
	);
}
