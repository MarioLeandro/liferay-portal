/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.application.list;

/**
 * Represents a navigation item inside an application defined by a {@link
 * PanelApp} implementation, such as one of the application's tabs or screens.
 *
 * @author Mario Leandro
 */
public class PanelAppNavigationItem {

	public PanelAppNavigationItem(
		String canonicalName, String href, String label) {

		_canonicalName = canonicalName;
		_href = href;
		_label = label;
	}

	/**
	 * Returns the item's label in English, used to identify the item
	 * independently of the current locale.
	 *
	 * @return the item's label in English
	 */
	public String getCanonicalName() {
		return _canonicalName;
	}

	/**
	 * Returns the URL that renders the item.
	 *
	 * @return the URL that renders the item
	 */
	public String getHref() {
		return _href;
	}

	/**
	 * Returns the item's label in the current locale.
	 *
	 * @return the item's label in the current locale
	 */
	public String getLabel() {
		return _label;
	}

	private final String _canonicalName;
	private final String _href;
	private final String _label;

}