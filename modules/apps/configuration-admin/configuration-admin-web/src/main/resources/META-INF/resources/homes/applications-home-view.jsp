<%--
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ include file="/init.jsp" %>

<%@ page import="com.liferay.portal.kernel.util.HashMapBuilder" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>

<%
List<Map<String, Object>> categoriesMock = new ArrayList<>();

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_depot_web_portlet_DepotAdminPortlet")
    .put("label", "Asset Libraries")
    .put("icon", "books")
    .put("color", "outline-6")
    .put("url", "/group/control_panel/manage?p_p_id=com_liferay_depot_web_portlet_DepotAdminPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_content_dashboard_web_portlet_ContentDashboardAdminPortlet")
    .put("label", "Content Dashboard")
    .put("icon", "speed")
    .put("color", "outline-8")
    .put("url", "/group/guest/~/control_panel/manage?p_p_id=com_liferay_content_dashboard_web_portlet_ContentDashboardAdminPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_change_tracking_web_portlet_PublicationsPortlet")
    .put("label", "Publications")
    .put("icon", "book")
    .put("color", "outline-5")
    .put("url", "/group/guest/~/control_panel/manage?p_p_id=com_liferay_change_tracking_web_portlet_PublicationsPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_workflow_web_portlet_ControlPanelWorkflowPortlet")
    .put("label", "Process Builder")
    .put("icon", "icon-rule-builder")
    .put("color", "outline-7")
    .put("url", "/group/control_panel/manage?p_p_id=com_liferay_portal_workflow_web_portlet_ControlPanelWorkflowPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_workflow_metrics_web_internal_portlet_WorkflowMetricsPortlet")
    .put("label", "Metrics")
    .put("icon", "polls")
    .put("color", "outline-1")
    .put("url", "/group/control_panel/manage?p_p_id=com_liferay_portal_workflow_metrics_web_internal_portlet_WorkflowMetricsPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_workflow_web_internal_portlet_ControlPanelWorkflowInstancePortlet")
    .put("label", "Submissions")
    .put("icon", "envelope-open")
    .put("color", "outline-7")
    .put("url", "/group/control_panel/manage?p_p_id=com_liferay_portal_workflow_web_internal_portlet_ControlPanelWorkflowInstancePortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_search_experiences_web_internal_blueprint_admin_portlet_SXPBlueprintAdminPortlet")
    .put("label", "Blueprints")
    .put("icon", "diagram")
    .put("color", "outline-3")
    .put("url", "/group/guest/~/control_panel/manage?p_p_id=com_liferay_search_experiences_web_internal_blueprint_admin_portlet_SXPBlueprintAdminPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_search_tuning_synonyms_web_internal_portlet_SynonymsPortlet")
    .put("label", "Synonyms")
    .put("icon", "automatic-translate")
    .put("color", "outline-4")
    .put("url", "/group/guest/~/control_panel/manage?p_p_id=com_liferay_portal_search_tuning_synonyms_web_internal_portlet_SynonymsPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_search_tuning_rankings_web_internal_portlet_ResultRankingsPortlet")
    .put("label", "Result Rankings")
    .put("icon", "star")
    .put("color", "outline-2")
    .put("url", "/group/guest/~/control_panel/manage?p_p_id=com_liferay_portal_search_tuning_rankings_web_internal_portlet_ResultRankingsPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_announcements_web_portlet_AnnouncementsAdminPortlet")
    .put("label", "Announcements and Alerts")
    .put("icon", "bell-on")
    .put("color", "outline-6")
    .put("url", "/group/guest/~/control_panel/manage?p_p_id=com_liferay_announcements_web_portlet_AnnouncementsAdminPortlet")
    .build());

categoriesMock.add(HashMapBuilder.<String, Object>put("id", "com_liferay_client_extension_web_internal_portlet_ClientExtensionAdminPortlet")
    .put("label", "Client Extensions")
    .put("icon", "plug")
    .put("color", "outline-4")
    .put("url", "/group/guest/~/control_panel/manage?p_p_id=com_liferay_client_extension_web_internal_portlet_ClientExtensionAdminPortlet")
    .build());
%>

<react:component
    module="{ApplicationsHome} from configuration-admin-web"
    props='<%=
        HashMapBuilder.<String, Object>put("homeTitle", "Applications")
            .put("homeLogo", "http://localhost:8080/image/layout_set_logo?img_id=31401&t=1769625079933")
            .put("homeTitleColor", "outline-7")
            .put("categories", categoriesMock)
            .build()
    %>'
/>