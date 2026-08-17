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

		this(canonicalName, href, label, null);
	}

	public PanelAppNavigationItem(
		String canonicalName, String href, String label, String parentLabel) {

		_canonicalName = canonicalName;
		_href = href;
		_label = label;
		_parentLabel = parentLabel;
	}

	/**
	 * Returns an identifier for the item that does not depend on the current
	 * locale, such as its label in English.
	 *
	 * @return a locale independent identifier for the item
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

	/**
	 * Returns the label of the item's own parent in the current locale, or
	 * <code>null</code> when the application itself is the item's parent. An
	 * item nested below the application's screens renders this as context,
	 * since its parent is not listed alongside it.
	 *
	 * @return the label of the item's parent in the current locale
	 */
	public String getParentLabel() {
		return _parentLabel;
	}

	private final String _canonicalName;
	private final String _href;
	private final String _label;
	private final String _parentLabel;

}