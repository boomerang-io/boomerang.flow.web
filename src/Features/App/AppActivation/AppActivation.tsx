import React from "react";
import { useMutation } from "react-query";
import { ComposedModal, ModalForm, Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter, TextInput, InlineNotification } from "carbon-components-react";
import { resolver } from "Config/servicesConfig";

import styles from "./AppActivation.module.scss";

interface PlatformActivationProps {
  setActivationCode: (code: string) => void;
}

const AppActivation: React.FC<PlatformActivationProps> = ({ setActivationCode }) => {
  return (
    <ComposedModal
      isOpen
      composedModalProps={{
        containerClassName: styles.container,
        shouldCloseOnOverlayClick: false,
        shouldCloseOnEsc: false,
      }}
      modalHeaderProps={{
        title: `G’day! Let’s activate Boomerang Flow`,
        subtitle: (
          <>
            <span className={styles.break}>
              To ensure that Boomerang Flow is secure, we have generated a one-time token during the installation
              process that can be used to complete the post-installation steps and activate this Boomerang Flow
              instance.
            </span>
            <span className={styles.break}>
              After providing the token, you will be prompted to agree to the plaform privacy statement to complete the
              activation. Your user will be created and granted platform administrator entitlements with full access.
              Please refer to the <a href={`docs/boomerang/architecture/security`}>security architecture docs</a> for
              more information.
            </span>
          </>
        ),
      }}
    >
      {() => <Form setActivationCode={setActivationCode} />}
    </ComposedModal>
  );
};

export default AppActivation;

const Form: React.FC<PlatformActivationProps> = ({ setActivationCode }) => {
  const [code, setCode] = React.useState("");
  const [validateActivationCodeMutator, { isLoading, error }] = useMutation(resolver.postValidateActivationCode);

  const handleValidateCode = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await validateActivationCodeMutator({ body: { otc: code } });
      setActivationCode(code);
    } catch (err) {
      // no-op
    }
  };

  return (
    <ModalForm onSubmit={handleValidateCode}>
      <ModalBody>
        {isLoading && <Loading />}
        <TextInput
          id="activation-code"
          labelText="Activation code"
          helperText="Look for it in your shell"
          onChange={(e) => setCode(e.target.value)}
        />
        {error && (
          <InlineNotification kind="error" title="Invalid Code" subtitle="That doesn't match what we have saved." />
        )}
      </ModalBody>
      <ModalFooter>
        <Button disabled={!code || isLoading} type="submit">
          {isLoading ? "Validating..." : error ? "Try again?" : "Submit"}
        </Button>
      </ModalFooter>
    </ModalForm>
  );
};