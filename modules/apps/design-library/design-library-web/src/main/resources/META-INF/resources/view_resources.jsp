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

<div>
	<div>
		<react:component
			module="{DesignLibraryBreadcrumb} from design-library-web"
			props="<%= designLibraryResourcesDisplayContext.getBreadcrumbProps(designLibraryEntryId) %>"
		/>
	</div>

	<div class="p-4">
		<div class="row">
			<div class="col-12 col-lg-8">
				<div class="card">
					<div class="card-body">
						<div>
							<react:component
								module="{DesignLibraryAssetsSectionHeader} from design-library-web"
								props="<%= designLibraryResourcesDisplayContext.getFDSAdditionalProps(designLibraryEntryId) %>"
							/>
						</div>

						<c:choose>
							<c:when test="<%= designLibraryResourcesDisplayContext.hasContentAccess(designLibraryEntryId) %>">
								<div class="design-library-fds-wrapper design-library-fds-wrapper--resources">
									<frontend-data-set:headless-display
										additionalProps="<%= designLibraryResourcesDisplayContext.getFDSAdditionalProps(designLibraryEntryId) %>"
										apiURL="<%= designLibraryResourcesDisplayContext.getAPIURL(designLibraryEntryId) %>"
										emptyState="<%= designLibraryResourcesDisplayContext.getEmptyState() %>"
										fdsActionDropdownItems="<%= designLibraryResourcesDisplayContext.getFDSActionDropdownItems(designLibraryEntryId) %>"
										formName="fm"
										id="<%= DesignLibraryAdminFDSNames.DESIGN_LIBRARY_RESOURCES %>"
										propsTransformer="{DesignLibraryResourcesFDSPropsTransformer} from design-library-web"
									/>
								</div>
							</c:when>
							<c:otherwise>
								<clay:alert
									displayType="info"
									message="you-do-not-have-access-to-any-content-in-this-design-library"
								/>
							</c:otherwise>
						</c:choose>
					</div>
				</div>
			</div>

			<div class="col-12 col-lg-4">
				<div class="card design-library-summary-card mb-4">
					<div class="card-body design-library-members-fds">
						<div>
							<react:component
								module="{DesignLibraryMembersSectionHeader} from design-library-web"
								props="<%= designLibraryResourcesDisplayContext.getMembersSectionHeaderProps(designLibraryEntryId) %>"
							/>
						</div>

						<clay:tabs
							tabsItems="<%= designLibraryResourcesDisplayContext.getMembersTabsItems() %>"
						>
							<clay:tabs-panel>
								<div class="design-library-summary-fds">
									<frontend-data-set:headless-display
										additionalProps="<%= designLibraryResourcesDisplayContext.getMembersFDSAdditionalProps(designLibraryEntryId) %>"
										apiURL="<%= designLibraryResourcesDisplayContext.getMembersUsersAPIURL(designLibraryEntryId) %>"
										emptyState="<%= designLibraryResourcesDisplayContext.getMembersEmptyState() %>"
										formName="fm"
										id="<%= DesignLibraryAdminFDSNames.DESIGN_LIBRARY_MEMBERS_USERS %>"
										propsTransformer="{DesignLibraryMembersFDSPropsTransformer} from design-library-web"
										showManagementBar="<%= false %>"
										showPagination="<%= false %>"
										showSearch="<%= false %>"
										showSelectAll="<%= false %>"
										style="fluid"
									/>
								</div>
							</clay:tabs-panel>

							<clay:tabs-panel>
								<div class="design-library-summary-fds">
									<frontend-data-set:headless-display
										additionalProps="<%= designLibraryResourcesDisplayContext.getMembersFDSAdditionalProps(designLibraryEntryId) %>"
										apiURL="<%= designLibraryResourcesDisplayContext.getMembersUserGroupsAPIURL(designLibraryEntryId) %>"
										emptyState="<%= designLibraryResourcesDisplayContext.getMembersEmptyState() %>"
										formName="fm"
										id="<%= DesignLibraryAdminFDSNames.DESIGN_LIBRARY_MEMBERS_USER_GROUPS %>"
										propsTransformer="{DesignLibraryMembersFDSPropsTransformer} from design-library-web"
										showManagementBar="<%= false %>"
										showPagination="<%= false %>"
										showSearch="<%= false %>"
										showSelectAll="<%= false %>"
										style="fluid"
									/>
								</div>
							</clay:tabs-panel>
						</clay:tabs>
					</div>
				</div>

				<div class="card design-library-summary-card">
					<div class="card-body">
						<div>
							<react:component
								module="{DesignLibraryConnectedSitesSectionHeader} from design-library-web"
								props="<%= designLibraryResourcesDisplayContext.getConnectedSitesSectionHeaderProps(designLibraryEntryId) %>"
							/>
						</div>

						<div class="design-library-summary-fds">
							<frontend-data-set:headless-display
								additionalProps="<%= designLibraryResourcesDisplayContext.getConnectedSitesFDSAdditionalProps(designLibraryEntryId) %>"
								apiURL="<%= designLibraryResourcesDisplayContext.getConnectedSitesAPIURL(designLibraryEntryId) %>"
								emptyState="<%= designLibraryResourcesDisplayContext.getConnectedSitesEmptyState() %>"
								formName="fm"
								id="<%= DesignLibraryAdminFDSNames.DESIGN_LIBRARY_CONNECTED_SITES %>"
								propsTransformer="{DesignLibraryConnectedSitesFDSPropsTransformer} from design-library-web"
								showManagementBar="<%= false %>"
								showPagination="<%= false %>"
								showSearch="<%= false %>"
								showSelectAll="<%= false %>"
								style="fluid"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>