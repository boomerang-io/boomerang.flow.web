import React from "react";
import { useMutation, queryCache } from "react-query";
import { Button, ConfirmModal, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { Checkmark16, Close16 } from "@carbon/icons-react";
import { Link } from "react-router-dom";
import FeatureHeader from "Components/FeatureHeader";
import Navigation from "./Navigation";
import { appLink } from "Config/appConfig";
import { resolver, serviceUrl } from "Config/servicesConfig";

import styles from "./Header.module.scss";

import { FlowTeam } from "Types";

function TeamDetailedHeader({ isActive, team, userType }: { isActive: boolean; team: FlowTeam; userType: string }) {
  const [removeTeamMutator] = useMutation(resolver.putUpdateTeam, {
    onSuccess: () => queryCache.invalidateQueries(serviceUrl.getManageTeam({ teamId: team.id })),
  });

  const removeTeam = async () => {
    try {
      await removeTeamMutator({ teamId: team.id, body: { isActive: false } });
      notify(
        <ToastNotification title="Add User" subtitle={`Request to close ${team.name} successful`} kind="success" />
      );
    } catch (error) {
      // noop
    }
  };

  return (
    <FeatureHeader includeBorder className={styles.container}>
      <section className={styles.header}>
        <div className={styles.breadcrumbContainer}>
          <Link className={styles.teamsLink} to={appLink.teamList()}>
            Teams
          </Link>
          <span className={styles.breadcrumbDivider}>/</span>
          <p className={styles.teamName}>{team.name}</p>
        </div>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>{team.name}</h1>
        </div>
        <h2 className={styles.subtitle}>
          <div className={styles.status}>
            {isActive ? <Checkmark16 style={{ fill: "#009d9a" }} /> : <Close16 style={{ fill: "#da1e28" }} />}
            <p className={styles.statusText}>{isActive ? "Active" : "Inactive"}</p>
          </div>
          <span className={styles.statusDivider}>-</span>
          {/*<div className={styles.dateText}>
            Created on
            <p style={{ marginLeft: "0.3rem" }}>{moment(team.dateCreated).format("MMMM DD, YYYY")}</p>
           </div>*/}
        </h2>
      </section>
      {isActive && (
        <section className={styles.teamButtons}>
          <ConfirmModal
            affirmativeAction={() => removeTeam()}
            affirmativeButtonProps={{ kind: "danger", "data-testid": "confirm-close-team" }}
            title={`Close ${team.name}?`}
            negativeText="Cancel"
            affirmativeText="Close"
            modalTrigger={({ openModal }: { openModal: () => void }) => (
              <Button
                iconDescription="Close"
                kind="danger"
                onClick={openModal}
                renderIcon={Close16}
                size="field"
                data-testid="close-team"
              >
                Close Team
              </Button>
            )}
          >
            Closing a team will submit a "leave team" request for each user on the team. After the requests are
            processed, the team will become "inactive". Are you sure you want to do this?
          </ConfirmModal>
        </section>
      )}
      <Navigation teamId={team.id} />
    </FeatureHeader>
  );
}

export default TeamDetailedHeader;
