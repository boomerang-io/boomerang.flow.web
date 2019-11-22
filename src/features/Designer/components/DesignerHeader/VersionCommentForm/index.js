import React, { Component } from "react";
import PropTypes from "prop-types";
import { Error, TextArea } from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";

//TODO: refactor this. It is bad.
class VersionCommentForm extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    closeModal: PropTypes.func
  };

  state = {
    versionComment: "",
    error: false,
    saveError: false
  };

  handleOnChange = e => {
    const { value } = e.target;
    let error = false;
    if (!value || value.length > 128) {
      error = true;
    }
    this.setState(
      () => ({
        versionComment: value,
        error: error
      }),
      () => {
        this.props.setShouldConfirmModalClose(true);
        this.props.handleOnChange(value);
      }
    );
  };

  handleOnSave = () => {
    if (!this.props.loading) {
      this.props
        .onSave()
        .then(() => {
          this.props.setShouldConfirmModalClose(false);
          this.props.closeModal();
        })
        .catch(() => {
          this.setState({ saveError: true });
        });
    }
  };

  render() {
    const { loading } = this.props;

    return (
      <>
        <ModalBody>
          {this.state.saveError ? (
            <Error />
          ) : (
            <TextArea
              required
              id="versionComment"
              invalid={this.state.error}
              invalidText="Comment is required"
              labelText="Version comment"
              name="versionComment"
              onChange={this.handleOnChange}
              placeholder="Enter version comment"
              value={this.state.versionComment}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" type="button" onClick={this.props.closeModal}>
            Cancel
          </Button>
          <Button disabled={this.state.error || loading} onClick={this.handleOnSave}>
            Create
          </Button>
        </ModalFooter>
      </>
    );
  }
}

export default VersionCommentForm;
