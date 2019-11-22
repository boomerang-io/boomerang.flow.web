import merge from "lodash/merge";
import { PortModel } from "@projectstorm/react-diagrams";
import CustomLinkModel from "Utilities/taskLink/TaskLinkModel";

export default class StartEndPortModel extends PortModel {
  constructor(pos) {
    super(pos, "startend");
    this.position = pos;
  }

  serialize() {
    return merge(super.serialize(), {
      position: this.position,
      nodePortId: this.id
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.position = data.position;
    this.id = data.nodePortId;
  }

  canLinkToPort(target) {
    if (this.position === "right" && target.position === "left") {
      return true;
    }
    return false;
  }

  createLinkModel() {
    return new CustomLinkModel();
  }
}
