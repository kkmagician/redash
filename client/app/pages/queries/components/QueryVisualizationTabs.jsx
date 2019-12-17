import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { find, orderBy } from "lodash";
import Tabs from "antd/lib/tabs";
import { VisualizationRenderer } from "@/visualizations/VisualizationRenderer";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal";

import "./query-visualization-tabs.less";

const { TabPane } = Tabs;

function TabWithDeleteButton({ visualizationName, canDelete, onDelete }) {
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    Modal.confirm({
      title: "Delete Visualization",
      content: "Are you sure you want to delete this visualization?",
      okText: "Delete",
      okType: "danger",
      onOk: onDelete,
      maskClosable: true,
      autoFocusButton: null,
    });
  }, [onDelete]);

  return (
    <>
      {visualizationName}
      {canDelete && (
        <a className="hidden-xs delete-visualization-button" onClick={handleDelete}>
          <i className="zmdi zmdi-close" />
        </a>
      )}
    </>
  );
}

TabWithDeleteButton.propTypes = {
  visualizationName: PropTypes.string.isRequired,
  canDelete: PropTypes.bool,
  onDelete: PropTypes.func,
};
TabWithDeleteButton.defaultProps = { canDelete: false, onDelete: () => {} };

export default function QueryVisualizationTabs({
  visualizations,
  queryResult,
  selectedTab,
  showNewVisualizationButton,
  canDeleteVisualizations,
  onChangeTab,
  onClickNewVisualization,
  onDeleteVisualization,
}) {
  const tabsProps = {};
  if (find(visualizations, { id: selectedTab })) {
    tabsProps.activeKey = `${selectedTab}`;
  }

  if (showNewVisualizationButton) {
    tabsProps.tabBarExtraContent = (
      <Button onClick={onClickNewVisualization}>
        <i className="fa fa-plus" />
        <span className="m-l-5 hidden-xs">New Visualization</span>
      </Button>
    );
  }

  const orderedVisualizations = useMemo(() => orderBy(visualizations, ["id"]), [visualizations]);
  const isFirstVisualization = useCallback(visId => visId === orderedVisualizations[0].id, [orderedVisualizations]);

  return (
    <Tabs
      {...tabsProps}
      className="query-visualization-tabs"
      animated={false}
      tabBarGutter={0}
      onChange={activeKey => onChangeTab(+activeKey)}
      destroyInactiveTabPane
    >
      {orderedVisualizations.map(visualization => (
        <TabPane
          key={`${visualization.id}`}
          tab={(
            <TabWithDeleteButton
              canDelete={canDeleteVisualizations && !isFirstVisualization(visualization.id)}
              visualizationName={visualization.name}
              onDelete={() => onDeleteVisualization(visualization)}
            />
          )}
        >
          <VisualizationRenderer visualization={visualization} queryResult={queryResult} context="query" />
        </TabPane>
      ))}
    </Tabs>
  );
}

QueryVisualizationTabs.propTypes = {
  queryResult: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  visualizations: PropTypes.arrayOf(PropTypes.object),
  selectedTab: PropTypes.number,
  showNewVisualizationButton: PropTypes.bool,
  canDeleteVisualizations: PropTypes.bool,
  onChangeTab: PropTypes.func,
  onClickNewVisualization: PropTypes.func,
  onDeleteVisualization: PropTypes.func,
};

QueryVisualizationTabs.defaultProps = {
  queryResult: null,
  visualizations: [],
  selectedTab: null,
  showNewVisualizationButton: false,
  canDeleteVisualizations: false,
  onChangeTab: () => {},
  onClickNewVisualization: () => {},
  onDeleteVisualization: () => {},
};
