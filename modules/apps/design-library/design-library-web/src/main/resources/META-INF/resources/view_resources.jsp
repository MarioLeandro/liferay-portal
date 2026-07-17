<%--
/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ include file="/init.jsp" %>

<%
long designLibraryEntryId = (long)request.getAttribute(DesignLibraryConstants.DESIGN_LIBRARY_ENTRY_ID_KEY);

DesignLibraryResourcesDisplayContext designLibraryResourcesDisplayContext = new DesignLibraryResourcesDisplayContext(request, liferayPortletResponse);
%>

<div class="design-library-home p-4">
	<div>
		<react:component
			module="{DesignLibraryBreadcrumb} from design-library-web"
			props="<%= designLibraryResourcesDisplayContext.getBreadcrumbProps(designLibraryEntryId) %>"
		/>
	</div>

	<div class="row">
		<div class="col-lg-8">
			<div class="card">
				<div class="card-body">
					<h2 class="font-weight-semi-bold h4 mb-3"><liferay-ui:message key="design-assets" /></h2>

					<div class="design-library-fds-wrapper design-library-fds-wrapper--resources">
						<frontend-data-set:headless-display
							additionalProps="<%= designLibraryResourcesDisplayContext.getFDSAdditionalProps(designLibraryEntryId) %>"
							apiURL="<%= designLibraryResourcesDisplayContext.getAPIURL(designLibraryEntryId) %>"
							emptyState="<%= designLibraryResourcesDisplayContext.getEmptyState() %>"
							fdsActionDropdownItems="<%= designLibraryResourcesDisplayContext.getFDSActionDropdownItems(designLibraryEntryId) %>"
							formName="fm"
							id="<%= DesignLibraryAdminFDSNames.DESIGN_LIBRARY_RESOURCES %>"
							propsTransformer="{DesignLibraryResourcesFDSPropsTransformer} from design-library-web"
							selectedItemsKey="embedded.id"
							selectionType="multiple"
						/>
					</div>
				</div>
			</div>

			<div class="card mt-4">
				<div class="card-body">
					<h2 class="font-weight-semi-bold h4 mb-3"><liferay-ui:message key="usage-statistics" /></h2>

					<p class="text-secondary"><liferay-ui:message key="coming-soon" /></p>
				</div>
			</div>
		</div>

		<div class="col-lg-4">
			<div class="card">
				<div class="card-body">
					<react:component
						module="{DesignLibraryMembersSection} from design-library-web"
						props="<%= designLibraryResourcesDisplayContext.getMembersSectionProps(designLibraryEntryId) %>"
					/>
				</div>
			</div>

			<div class="card mt-4">
				<div class="card-body">
					<react:component
						module="{DesignLibraryConnectedSitesSection} from design-library-web"
						props="<%= designLibraryResourcesDisplayContext.getConnectedSitesSectionProps(designLibraryEntryId) %>"
					/>
				</div>
			</div>
		</div>
	</div>
</div>