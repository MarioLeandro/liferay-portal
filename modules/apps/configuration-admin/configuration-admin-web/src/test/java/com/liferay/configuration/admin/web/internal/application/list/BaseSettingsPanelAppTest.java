/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.configuration.admin.web.internal.application.list;

import com.liferay.application.list.PanelAppNavigationItem;
import com.liferay.configuration.admin.web.internal.display.ConfigurationCategoryDisplay;
import com.liferay.configuration.admin.web.internal.display.ConfigurationCategoryMenuDisplay;
import com.liferay.configuration.admin.web.internal.display.ConfigurationCategorySectionDisplay;
import com.liferay.configuration.admin.web.internal.display.ConfigurationEntry;
import com.liferay.configuration.admin.web.internal.util.ConfigurationEntryRetriever;
import com.liferay.portal.kernel.model.Portlet;
import com.liferay.portal.kernel.portlet.url.builder.PortletURLBuilder;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.portlet.MockLiferayPortletURL;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import jakarta.portlet.PortletURL;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

import org.mockito.Mockito;

/**
 * @author Mario Leandro
 */
public class BaseSettingsPanelAppTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Before
	public void setUp() {
		ReflectionTestUtil.setFieldValue(
			_testSettingsPanelApp, "configurationEntryRetriever",
			_configurationEntryRetriever);

		Mockito.when(
			_httpServletRequest.getAttribute(WebKeys.THEME_DISPLAY)
		).thenReturn(
			_themeDisplay
		);

		Mockito.when(
			_themeDisplay.getLanguageId()
		).thenReturn(
			LocaleUtil.toLanguageId(LocaleUtil.US)
		);

		Mockito.when(
			_themeDisplay.getLocale()
		).thenReturn(
			LocaleUtil.US
		);

		_setUpConfigurationEntryRetriever();
	}

	@Test
	public void testGetPanelAppNavigationItems() throws Exception {
		List<PanelAppNavigationItem> panelAppNavigationItems =
			_testSettingsPanelApp.getPanelAppNavigationItems(
				_httpServletRequest);

		Assert.assertEquals(
			panelAppNavigationItems.toString(), 2,
			panelAppNavigationItems.size());

		PanelAppNavigationItem panelAppNavigationItem =
			panelAppNavigationItems.get(0);

		Assert.assertEquals("Factory", panelAppNavigationItem.getLabel());

		String href = panelAppNavigationItem.getHref();

		Assert.assertTrue(href, href.contains("factoryPid=factoryPidValue"));

		panelAppNavigationItem = panelAppNavigationItems.get(1);

		Assert.assertEquals("Screen", panelAppNavigationItem.getLabel());

		href = panelAppNavigationItem.getHref();

		Assert.assertTrue(
			href, href.contains("configurationScreenKey=screenKeyValue"));
	}

	@Test
	public void testGetPanelAppNavigationItemsHasNoSharedParameters()
		throws Exception {

		List<PanelAppNavigationItem> panelAppNavigationItems =
			_testSettingsPanelApp.getPanelAppNavigationItems(
				_httpServletRequest);

		PanelAppNavigationItem panelAppNavigationItem =
			panelAppNavigationItems.get(1);

		Assert.assertFalse(
			panelAppNavigationItem.getHref(),
			panelAppNavigationItem.getHref(
			).contains(
				"factoryPid=factoryPidValue"
			));
	}

	@Test
	public void testGetPanelAppNavigationItemsSkipsEmptyCategories()
		throws Exception {

		Mockito.when(
			_factoryConfigurationCategoryMenuDisplay.isEmpty()
		).thenReturn(
			true
		);

		List<PanelAppNavigationItem> panelAppNavigationItems =
			_testSettingsPanelApp.getPanelAppNavigationItems(
				_httpServletRequest);

		Assert.assertEquals(
			panelAppNavigationItems.toString(), 1,
			panelAppNavigationItems.size());
	}

	private ConfigurationCategoryDisplay _getConfigurationCategoryDisplay(
		String categoryKey, String categoryLabel) {

		ConfigurationCategoryDisplay configurationCategoryDisplay =
			Mockito.mock(ConfigurationCategoryDisplay.class);

		Mockito.when(
			configurationCategoryDisplay.getCategoryKey()
		).thenReturn(
			categoryKey
		);

		Mockito.when(
			configurationCategoryDisplay.getCategoryLabel(
				Mockito.any(Locale.class))
		).thenReturn(
			categoryLabel
		);

		return configurationCategoryDisplay;
	}

	private ConfigurationCategoryMenuDisplay
		_getConfigurationCategoryMenuDisplay(String name, String value) {

		ConfigurationCategoryMenuDisplay configurationCategoryMenuDisplay =
			Mockito.mock(ConfigurationCategoryMenuDisplay.class);

		ConfigurationEntry configurationEntry = Mockito.mock(
			ConfigurationEntry.class);

		Mockito.when(
			configurationEntry.getEditURL(Mockito.any(PortletURL.class))
		).thenAnswer(
			invocationOnMock -> PortletURLBuilder.create(
				(PortletURL)invocationOnMock.getArgument(0)
			).setParameter(
				name, value
			).buildString()
		);

		Mockito.when(
			configurationCategoryMenuDisplay.getFirstConfigurationEntry()
		).thenReturn(
			configurationEntry
		);

		return configurationCategoryMenuDisplay;
	}

	private void _setUpConfigurationEntryRetriever() {
		ConfigurationCategoryDisplay factoryConfigurationCategoryDisplay =
			_getConfigurationCategoryDisplay("factory", "Factory");
		ConfigurationCategoryDisplay screenConfigurationCategoryDisplay =
			_getConfigurationCategoryDisplay("screen", "Screen");

		ConfigurationCategorySectionDisplay
			configurationCategorySectionDisplay = Mockito.mock(
				ConfigurationCategorySectionDisplay.class);

		Mockito.when(
			configurationCategorySectionDisplay.
				getConfigurationCategoryDisplays()
		).thenReturn(
			Arrays.asList(
				factoryConfigurationCategoryDisplay,
				screenConfigurationCategoryDisplay)
		);

		List<ConfigurationCategorySectionDisplay>
			configurationCategorySectionDisplays = Arrays.asList(
				configurationCategorySectionDisplay);

		Mockito.when(
			_configurationEntryRetriever.
				getConfigurationCategorySectionDisplays(
					Mockito.any(), Mockito.any())
		).thenReturn(
			configurationCategorySectionDisplays
		);

		_factoryConfigurationCategoryMenuDisplay =
			_getConfigurationCategoryMenuDisplay(
				"factoryPid", "factoryPidValue");

		ConfigurationCategoryMenuDisplay
			screenConfigurationCategoryMenuDisplay =
				_getConfigurationCategoryMenuDisplay(
					"configurationScreenKey", "screenKeyValue");

		Mockito.when(
			_configurationEntryRetriever.getConfigurationCategoryMenuDisplay(
				Mockito.eq("factory"), Mockito.anyString(), Mockito.any(),
				Mockito.any())
		).thenReturn(
			_factoryConfigurationCategoryMenuDisplay
		);

		Mockito.when(
			_configurationEntryRetriever.getConfigurationCategoryMenuDisplay(
				Mockito.eq("screen"), Mockito.anyString(), Mockito.any(),
				Mockito.any())
		).thenReturn(
			screenConfigurationCategoryMenuDisplay
		);
	}

	private final ConfigurationEntryRetriever _configurationEntryRetriever =
		Mockito.mock(ConfigurationEntryRetriever.class);
	private ConfigurationCategoryMenuDisplay
		_factoryConfigurationCategoryMenuDisplay;
	private final HttpServletRequest _httpServletRequest = Mockito.mock(
		HttpServletRequest.class);

	private final BaseSettingsPanelApp _testSettingsPanelApp =
		new BaseSettingsPanelApp() {

			@Override
			public String getIcon() {
				return "cog";
			}

			@Override
			public Portlet getPortlet() {
				return null;
			}

			@Override
			public String getPortletId() {
				return "testSettingsPortletId";
			}

			@Override
			public PortletURL getPortletURL(
				HttpServletRequest httpServletRequest) {

				return new MockLiferayPortletURL();
			}

		};

	private final ThemeDisplay _themeDisplay = Mockito.mock(ThemeDisplay.class);

}