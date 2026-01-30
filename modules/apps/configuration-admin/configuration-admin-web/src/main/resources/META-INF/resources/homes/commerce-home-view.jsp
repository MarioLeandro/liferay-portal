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

List<Map<String, Object>> quickActionApps = new ArrayList<>();
quickActionApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_catalog_web_internal_portlet_CommerceCatalogsPortlet")
    .put("label", "Add New Product").put("icon", "price-tag")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_catalog_web_internal_portlet_CommerceCatalogsPortlet").build());

quickActionApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_product_definitions_web_internal_portlet_CPDefinitionsPortlet")
    .put("label", "Add New Catalog").put("icon", "catalog")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_product_definitions_web_internal_portlet_CPDefinitionsPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Quick Actions").put("panelApps", quickActionApps).build());


List<Map<String, Object>> orderApps = new ArrayList<>();
orderApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_order_web_internal_portlet_CommerceOrderPortlet")
    .put("label", "Orders").put("icon", "list").put("color", "outline-1")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_order_web_internal_portlet_CommerceOrderPortlet").build());

orderApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_order_web_internal_portlet_CommerceOrderTypePortlet")
    .put("label", "Order Types").put("icon", "users").put("color", "outline-2")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_order_web_internal_portlet_CommerceOrderTypePortlet").build());

orderApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_order_rule_web_internal_portlet_COREntryPortlet")
    .put("label", "Order Rules").put("icon", "users").put("color", "outline-3")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_order_rule_web_internal_portlet_COREntryPortlet").build());

orderApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_shipment_web_internal_portlet_CommerceShipmentPortlet")
    .put("label", "Shipments").put("icon", "truck").put("color", "outline-4")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_shipment_web_internal_portlet_CommerceShipmentPortlet").build());

orderApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_subscription_web_internal_portlet_CommerceSubscriptionEntryPortlet")
    .put("label", "Subscriptions").put("icon", "reload").put("color", "outline-5")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_subscription_web_internal_portlet_CommerceSubscriptionEntryPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Order Management").put("panelApps", orderApps).build());

List<Map<String, Object>> inventoryApps = new ArrayList<>();
inventoryApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_inventory_web_internal_portlet_CommerceInventoryPortlet")
    .put("label", "Inventory").put("icon", "archive").put("color", "outline-6")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_inventory_web_internal_portlet_CommerceInventoryPortlet").build());

inventoryApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_warehouse_web_internal_portlet_CommerceInventoryWarehousePortlet")
    .put("label", "Warehouses").put("icon", "home").put("color", "outline-7")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_warehouse_web_internal_portlet_CommerceInventoryWarehousePortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Inventory Management").put("panelApps", inventoryApps).build());

List<Map<String, Object>> pricingApps = new ArrayList<>();
pricingApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_pricing_web_internal_portlet_CommercePriceListPortlet")
    .put("label", "Price Lists").put("icon", "users").put("color", "outline-8")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_pricing_web_internal_portlet_CommercePriceListPortlet").build());

pricingApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_pricing_web_internal_portlet_CommercePromotionPortlet")
    .put("label", "Promotions").put("icon", "star").put("color", "outline-1")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_pricing_web_internal_portlet_CommercePromotionPortlet").build());

pricingApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_pricing_web_internal_portlet_CommerceDiscountPortlet")
    .put("label", "Discounts").put("icon", "users").put("color", "outline-2")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_pricing_web_internal_portlet_CommerceDiscountPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Pricing").put("panelApps", pricingApps).build());

List<Map<String, Object>> productApps = new ArrayList<>();
productApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_catalog_web_internal_portlet_CommerceCatalogsPortlet")
    .put("label", "Catalogs").put("icon", "book").put("color", "outline-3")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_catalog_web_internal_portlet_CommerceCatalogsPortlet").build());

productApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_product_definitions_web_internal_portlet_CPDefinitionsPortlet")
    .put("label", "Products").put("icon", "price-tag").put("color", "outline-4")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_product_definitions_web_internal_portlet_CPDefinitionsPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Product Management").put("panelApps", productApps).build());

List<Map<String, Object>> storeApps = new ArrayList<>();
storeApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_channel_web_internal_portlet_CommerceChannelsPortlet")
    .put("label", "Channels").put("icon", "sites").put("color", "outline-5")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_channel_web_internal_portlet_CommerceChannelsPortlet").build());

storeApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_currency_web_internal_portlet_CommerceCurrencyPortlet")
    .put("label", "Currencies").put("icon", "change").put("color", "outline-6")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_currency_web_internal_portlet_CommerceCurrencyPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Store Management").put("panelApps", storeApps).build());

List<Map<String, Object>> settingApps = new ArrayList<>();
settingApps.add(HashMapBuilder.<String, Object>put("id", "com_liferay_commerce_health_status_web_internal_portlet_CommerceHealthCheckPortlet")
    .put("label", "Health Check").put("icon", "users").put("color", "outline-7")
    .put("url", "http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_commerce_health_status_web_internal_portlet_CommerceHealthCheckPortlet").build());

groupedCategories.add(HashMapBuilder.<String, Object>put("label", "Settings").put("panelApps", settingApps).build());
%>

<react:component
    module="{CommerceHome} from configuration-admin-web"
    props='<%=
        HashMapBuilder.<String, Object>put("homeTitle", "Commerce")
            .put("homeLogo", "http://localhost:8080/image/layout_set_logo?img_id=31401")
            .put("homeTitleColor", "outline-7")
            .put("categories", groupedCategories)
            .build()
    %>'
/>