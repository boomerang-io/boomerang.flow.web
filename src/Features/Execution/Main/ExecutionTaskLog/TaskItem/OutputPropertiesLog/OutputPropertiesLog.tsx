import React from "react";
import ReactJson from "react-json-view";
import { ComposedModal, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalBody, Tabs, Tab } from "@boomerang-io/carbon-addons-boomerang-react";
import PropertiesTable from "./PropertiesTable";
import { ModalTriggerProps } from "Types";

import styles from "./outputPropertisLog.module.scss";

interface OutputPropertiesLogProps {
  flowTaskName: string;
  flowTaskOutputs: object[] | {};
}

const OutputPropertiesLog: React.FC<OutputPropertiesLogProps> = ({ flowTaskName, flowTaskOutputs }) => {
  let arrayProps: object[] = [];
  Object.keys(flowTaskOutputs).forEach(
    (val, index) =>
      (arrayProps = arrayProps.concat({
        id: `${val}-${index}`,
        key: val,
        //@ts-ignore
        value: JSON.stringify(flowTaskOutputs[val], null, 2),
      }))
  );

  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.container, shouldCloseOnOverlayClick: true }}
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your changes will not be saved",
      }}
      modalHeaderProps={{
        title: "Output Properties",
        label: `${flowTaskName}`,
      }}
      modalTrigger={({ openModal }: ModalTriggerProps) => (
        <button className={styles.trigger} onClick={openModal}>
          View Properties
        </button>
      )}
    >
      {() => (
        <ModalForm>
          <ModalBody>
            <Tabs>
              <Tab label="Table">
                <PropertiesTable properties={arrayProps} />
              </Tab>
              <Tab label="JSON">
                <div className={styles.propertiesJson}>
                  <ReactJson
                    name={false}
                    src={flowTaskOutputs}
                    displayDataTypes={false}
                    // enableDelete={false}
                    displayObjectSize={false}
                    // enableEdit={false}
                    // enableAdd={false}
                  />
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
        </ModalForm>
      )}
    </ComposedModal>
  );
};

export default OutputPropertiesLog;
