/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.configuration.admin.web.internal.display;

import com.liferay.portal.kernel.portlet.url.builder.PortletURLBuilder;

import jakarta.portlet.PortletURL;
import jakarta.portlet.RenderRequest;
import jakarta.portlet.RenderResponse;

/**
 * @author Jorge Ferrer
 */
public interface ConfigurationEntry {

	public String getCategory();

	public String getEditURL(PortletURL portletURL);

	public default String getEditURL(
		RenderRequest renderRequest, RenderResponse renderResponse) {

		return getEditURL(
			PortletURLBuilder.createRenderURL(
				renderResponse
			).buildPortletURL());
	}

	public String getKey();

	public String getName();

	public String getScope();

	public boolean isDeprecated();

}