import { NodeModel } from "storm-react-diagrams";
import StartEndPortModel from "./StartEndPortModel";
import merge from "lodash/merge";

export default class StartEndNodeModel extends NodeModel {
  //list all three params
  constructor(passedName, color) {
    //console.log("startend props");
    //console.log(this.props);
    super("startend");
    if (passedName === "Finish") {
      this.addPort(new StartEndPortModel("left"));
      //this.addInPort("left");
    } else {
      this.addPort(new StartEndPortModel("right"));
      //this.addOutPort("left");
    }
    this.passedName = passedName;
  }

  serialize() {
    return merge(super.serialize(), {
      passedName: this.passedName,
      nodeId: this.id
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.passedName = data.passedName;
    this.id = data.nodeId;
  }
}