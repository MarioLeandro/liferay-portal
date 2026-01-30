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
List<Map<String, Object>> groupedCategories = new ArrayList<>();

List<Map<String, Object>> contentApps = new ArrayList<>();
contentApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_depot_web_portlet_DepotAdminPortlet")
    .put("label", "Asset Libraries").put("icon", "books").put("color", "outline-6")
    .put("url", "http://localhost:8080/group/control_panel/manage?p_p_id=com_liferay_depot_web_portlet_DepotAdminPortlet").build());

contentApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_content_dashboard_web_portlet_ContentDashboardAdminPortlet")
    .put("label", "Content Dashboard").put("icon", "speed").put("color", "outline-8")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_content_dashboard_web_portlet_ContentDashboardAdminPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Content").put("panelApps", contentApps).build());

List<Map<String, Object>> publicationApps = new ArrayList<>();
publicationApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_change_tracking_web_portlet_PublicationsPortlet")
    .put("label", "Publications").put("icon", "book").put("color", "outline-5")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_change_tracking_web_portlet_PublicationsPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Publications").put("panelApps", publicationApps).build());

List<Map<String, Object>> workflowApps = new ArrayList<>();
workflowApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_workflow_web_portlet_ControlPanelWorkflowPortlet")
    .put("label", "Process Builder").put("icon", "icon-rule-builder").put("color", "outline-7")
    .put("url", "http://localhost:8080/group/control_panel/manage?p_p_id=com_liferay_portal_workflow_web_portlet_ControlPanelWorkflowPortlet").build());

workflowApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_workflow_metrics_web_internal_portlet_WorkflowMetricsPortlet")
    .put("label", "Metrics").put("icon", "polls").put("color", "outline-1")
    .put("url", "http://localhost:8080/group/control_panel/manage?p_p_id=com_liferay_portal_workflow_metrics_web_internal_portlet_WorkflowMetricsPortlet").build());

workflowApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_workflow_web_internal_portlet_ControlPanelWorkflowInstancePortlet")
    .put("label", "Submissions").put("icon", "envelope-open").put("color", "outline-7")
    .put("url", "http://localhost:8080/group/control_panel/manage?p_p_id=com_liferay_portal_workflow_web_internal_portlet_ControlPanelWorkflowInstancePortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Workflow").put("panelApps", workflowApps).build());

List<Map<String, Object>> searchExpApps = new ArrayList<>();
searchExpApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_search_experiences_web_internal_blueprint_admin_portlet_SXPBlueprintAdminPortlet")
    .put("label", "Blueprints").put("icon", "diagram").put("color", "outline-3")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_search_experiences_web_internal_blueprint_admin_portlet_SXPBlueprintAdminPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Search Experiences").put("panelApps", searchExpApps).build());

List<Map<String, Object>> searchTuningApps = new ArrayList<>();
searchTuningApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_search_tuning_synonyms_web_internal_portlet_SynonymsPortlet")
    .put("label", "Synonyms").put("icon", "automatic-translate").put("color", "outline-4")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_portal_search_tuning_synonyms_web_internal_portlet_SynonymsPortlet").build());

searchTuningApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_portal_search_tuning_rankings_web_internal_portlet_ResultRankingsPortlet")
    .put("label", "Result Rankings").put("icon", "star").put("color", "outline-2")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_portal_search_tuning_rankings_web_internal_portlet_ResultRankingsPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Search Tuning").put("panelApps", searchTuningApps).build());

List<Map<String, Object>> communicationApps = new ArrayList<>();
communicationApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_announcements_web_portlet_AnnouncementsAdminPortlet")
    .put("label", "Announcements and Alerts").put("icon", "bell-on").put("color", "outline-6")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_announcements_web_portlet_AnnouncementsAdminPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Communication").put("panelApps", communicationApps).build());

List<Map<String, Object>> customApps = new ArrayList<>();
customApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_client_extension_web_internal_portlet_ClientExtensionAdminPortlet")
    .put("label", "Client Extensions").put("icon", "plug").put("color", "outline-4")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_client_extension_web_internal_portlet_ClientExtensionAdminPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Custom Apps").put("panelApps", customApps).build());
%>

<react:component
    module="{ApplicationsHomeAlt} from configuration-admin-web"
    props='<%=
        HashMapBuilder.<String, Object>put("homeTitle", "Applications")
            .put("homeLogo", "http://localhost:8080/image/layout_set_logo?img_id=31401")
            .put("homeTitleColor", "outline-7")
            .put("categories", groupedCategories)
            .build()
    %>'
/>