import { PortModel } from "@projectstorm/react-diagrams";
import TaskLinkModel from "Utilities/taskLink/TaskLinkModel";
import merge from "lodash/merge";

export default class TemplatePortModel extends PortModel {
  constructor(position) {
    super(position, "template");
    this.position = position;
  }

  serialize() {
    return merge(super.serialize(), {
      nodePortId: this.id,
      position: this.position
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.id = data.nodePortId;
    this.position = data.position;
  }

  createLinkModel() {
    return new TaskLinkModel();
  }

  canLinkToPort(target) {
    return target.position === "left" && this.position === "right";
  }
}
