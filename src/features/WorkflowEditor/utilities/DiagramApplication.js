//import SRD from "storm-react-diagrams";
import { DiagramEngine, DiagramModel } from "storm-react-diagrams";

//ingestcsv files
//import { IngestCSVPortModel } from "Features/IngestCSV/IngestCSVPortModel";
import CustomTaskNodeFactory from "Utilities/customTaskNode/CustomTaskNodeFactory";
import { IngestCSVNodeModel } from "Utilities/customTaskNode/CustomTaskNodeModel";

import StartEndNodeFactory from "Utilities/customStartEndNode/StartEndNodeFactory";
import StartEndNodeModel from "Utilities/customStartEndNode/StartEndNodeModel";
import StartEndPortModel from "Utilities/customStartEndNode/StartEndPortModel";

import SimplePortFactory from "Utilities/simplePort/SimplePortFactory";
import CustomTaskPortModel from "Utilities/customTaskNode/CustomTaskPortModel";
import CustomLinkFactory from "Utilities/customLink/CustomLinkFactory";

export default class Application {
  constructor() {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new CustomTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new StartEndNodeFactory());

    //need to find a way to register port factory
    this.diagramEngine.registerPortFactory(new SimplePortFactory("startend", config => new StartEndPortModel()));
    this.diagramEngine.registerPortFactory(new SimplePortFactory("ingestcsv", config => new CustomTaskPortModel()));

    //register new custom link
    this.diagramEngine.registerLinkFactory(new CustomLinkFactory());

    this.newModel();
  }

  newModel() {
    this.activeModel = new DiagramModel();

    this.diagramEngine.setDiagramModel(this.activeModel);

    var EndNode = new StartEndNodeModel("Finish", "rgb(192,255,0)");
    EndNode.setPosition(1300, 400);
    var StartNode = new StartEndNodeModel("Start", "rgb(192,255,0)");
    StartNode.setPosition(300, 400);

    this.activeModel.addAll(StartNode, EndNode);
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
