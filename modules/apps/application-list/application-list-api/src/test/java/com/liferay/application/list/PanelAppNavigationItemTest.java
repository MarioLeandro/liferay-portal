/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.application.list;

import com.liferay.portal.test.rule.LiferayUnitTestRule;

import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

/**
 * @author Mario Leandro
 */
public class PanelAppNavigationItemTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Test
	public void testGetCanonicalName() {
		PanelAppNavigationItem panelAppNavigationItem =
			new PanelAppNavigationItem("canonicalName", "href", "label");

		Assert.assertEquals(
			"canonicalName", panelAppNavigationItem.getCanonicalName());
	}

	@Test
	public void testGetHref() {
		PanelAppNavigationItem panelAppNavigationItem =
			new PanelAppNavigationItem("canonicalName", "href", "label");

		Assert.assertEquals("href", panelAppNavigationItem.getHref());
	}

	@Test
	public void testGetLabel() {
		PanelAppNavigationItem panelAppNavigationItem =
			new PanelAppNavigationItem("canonicalName", "href", "label");

		Assert.assertEquals("label", panelAppNavigationItem.getLabel());
	}

	@Test
	public void testGetParentLabel() {
		PanelAppNavigationItem panelAppNavigationItem =
			new PanelAppNavigationItem(
				"canonicalName", "href", "label", "parentLabel");

		Assert.assertEquals(
			"parentLabel", panelAppNavigationItem.getParentLabel());

		panelAppNavigationItem = new PanelAppNavigationItem(
			"canonicalName", "href", "label");

		Assert.assertNull(panelAppNavigationItem.getParentLabel());
	}

}