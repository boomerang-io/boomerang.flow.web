import React from "react";
import { AbstractNodeFactory } from "storm-react-diagrams";
import CustomTaskNode from "Components/DiagramTaskNode";
import CustomTaskNodeModel from "./CustomTaskNodeModel";

export default class CustomTaskNodeFactory extends AbstractNodeFactory {
  constructor() {
    super("customTaskNode");
  }

  generateReactWidget(diagramEngine, node) {
    diagramEngine.registerNodeFactory(new CustomTaskNodeFactory());
    return <CustomTaskNode node={node} />;
  }

  getNewInstance() {
    return new CustomTaskNodeModel();
  }
}
