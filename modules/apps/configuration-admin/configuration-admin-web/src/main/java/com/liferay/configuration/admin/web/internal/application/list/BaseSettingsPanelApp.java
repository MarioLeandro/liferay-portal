/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.configuration.admin.web.internal.application.list;

import com.liferay.application.list.BasePanelApp;
import com.liferay.application.list.PanelAppNavigationItem;
import com.liferay.configuration.admin.web.internal.display.ConfigurationCategoryDisplay;
import com.liferay.configuration.admin.web.internal.display.ConfigurationCategoryMenuDisplay;
import com.liferay.configuration.admin.web.internal.display.ConfigurationCategorySectionDisplay;
import com.liferay.configuration.admin.web.internal.display.context.ConfigurationScopeDisplayContext;
import com.liferay.configuration.admin.web.internal.display.context.ConfigurationScopeDisplayContextFactory;
import com.liferay.configuration.admin.web.internal.util.ConfigurationCategoryUtil;
import com.liferay.configuration.admin.web.internal.util.ConfigurationEntryRetriever;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.WebKeys;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.List;

import org.osgi.service.component.annotations.Reference;

/**
 * @author Mario Leandro
 */
public abstract class BaseSettingsPanelApp extends BasePanelApp {

	@Override
	public List<PanelAppNavigationItem> getPanelAppNavigationItems(
			HttpServletRequest httpServletRequest)
		throws PortalException {

		List<PanelAppNavigationItem> panelAppNavigationItems =
			new ArrayList<>();

		ThemeDisplay themeDisplay =
			(ThemeDisplay)httpServletRequest.getAttribute(
				WebKeys.THEME_DISPLAY);

		ConfigurationScopeDisplayContext configurationScopeDisplayContext =
			ConfigurationScopeDisplayContextFactory.create(
				getPortletId(), themeDisplay);

		for (ConfigurationCategorySectionDisplay
				configurationCategorySectionDisplay :
					configurationEntryRetriever.
						getConfigurationCategorySectionDisplays(
							configurationScopeDisplayContext.getScope(),
							configurationScopeDisplayContext.getScopePK())) {

			for (ConfigurationCategoryDisplay configurationCategoryDisplay :
					configurationCategorySectionDisplay.
						getConfigurationCategoryDisplays()) {

				ConfigurationCategoryMenuDisplay
					configurationCategoryMenuDisplay =
						configurationEntryRetriever.
							getConfigurationCategoryMenuDisplay(
								configurationCategoryDisplay.getCategoryKey(),
								themeDisplay.getLanguageId(),
								configurationScopeDisplayContext.getScope(),
								configurationScopeDisplayContext.getScopePK());

				if (configurationCategoryMenuDisplay.isEmpty()) {
					continue;
				}

				panelAppNavigationItems.add(
					new PanelAppNavigationItem(
						configurationCategoryDisplay.getCategoryLabel(
							LocaleUtil.ENGLISH),
						ConfigurationCategoryUtil.getHref(
							configurationCategoryMenuDisplay,
							getPortletURL(httpServletRequest)),
						configurationCategoryDisplay.getCategoryLabel(
							themeDisplay.getLocale())));
			}
		}

		return panelAppNavigationItems;
	}

	@Reference
	protected ConfigurationEntryRetriever configurationEntryRetriever;

}