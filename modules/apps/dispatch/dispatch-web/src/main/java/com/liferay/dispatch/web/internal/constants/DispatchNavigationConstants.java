/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.dispatch.web.internal.constants;

import com.liferay.dispatch.web.internal.navigation.DispatchNavigationTab;

import java.util.List;

/**
 * Describes the application's tabs. Both the application's navigation bar and
 * the side navigation's filter read this list, so that adding a tab surfaces it
 * in both places.
 *
 * @author Mario Leandro
 */
public class DispatchNavigationConstants {

	public static final List<DispatchNavigationTab> tabs = List.of(
		new DispatchNavigationTab(
			"dispatch-triggers", "/dispatch/view_dispatch_trigger",
			"dispatch-trigger"),
		new DispatchNavigationTab(
			"scheduled-jobs", "/dispatch/edit_scheduler_response",
			"scheduler-response"));

}