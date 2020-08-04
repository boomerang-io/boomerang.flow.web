import React from "react";
import { useFeature } from "flagged";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { Activity16, ChartScatter16, FlowData16, Settings16, SettingsAdjust16 } from "@carbon/icons-react";
import { SideNav } from "carbon-components-react";
import {
  LeftSideNav,
  SideNavLink,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  UIShell,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { BASE_URL } from "Config/servicesConfig";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import { appLink, FeatureFlag } from "Config/appConfig";
import { UserType } from "Constants";
import { QueryResult } from "react-query";
import { FlowUser } from "Types";

const ACTIVE_CLASS_NAME = "bx--side-nav__link--current";

const handleOnMenuClick = (isAtLeastOperator: boolean, isStandaAloneMode: any) => ({
  isOpen,
  onMenuClose,
}: {
  isOpen: boolean;
  onMenuClose(): void;
}) => (
  <LeftSideNav isOpen={isOpen}>
    <SideNav aria-label="nav" expanded={isOpen} isChildOfHeader={true}>
      <SideNavItems>
        <SideNavLink
          large
          activeClassName={ACTIVE_CLASS_NAME}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={FlowData16}
          to={appLink.workflows()}
        >
          Workflows
        </SideNavLink>
        <SideNavLink
          large
          activeClassName={ACTIVE_CLASS_NAME}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={Activity16}
          to={appLink.activity()}
        >
          Activity
        </SideNavLink>
        <SideNavLink
          large
          activeClassName={ACTIVE_CLASS_NAME}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={ChartScatter16}
          to={appLink.insights()}
        >
          Insights
        </SideNavLink>
        <SideNavMenu large renderIcon={SettingsAdjust16} title="Management">
          <SideNavMenuItem
            large
            activeClassName={ACTIVE_CLASS_NAME}
            element={NavLink}
            onClick={onMenuClose}
            to={appLink.taskTemplates()}
          >
            Team Task Manager
          </SideNavMenuItem>
          <SideNavMenuItem
            large
            activeClassName={ACTIVE_CLASS_NAME}
            element={NavLink}
            onClick={onMenuClose}
            to={appLink.teamProperties()}
          >
            Team Properties
          </SideNavMenuItem>
        </SideNavMenu>
        {isAtLeastOperator ? (
          <SideNavMenu large title="Admin" renderIcon={Settings16}>
            {isStandaAloneMode && (
              <SideNavMenuItem
                large
                activeClassName={ACTIVE_CLASS_NAME}
                element={NavLink}
                onClick={onMenuClose}
                to={appLink.teamList()}
              >
                Teams
              </SideNavMenuItem>
            )}
            {isStandaAloneMode && (
              <SideNavMenuItem
                large
                activeClassName={ACTIVE_CLASS_NAME}
                element={NavLink}
                onClick={onMenuClose}
                to={appLink.manageUsers()}
              >
                Users
              </SideNavMenuItem>
            )}
            <SideNavMenuItem
              large
              activeClassName={ACTIVE_CLASS_NAME}
              element={NavLink}
              onClick={onMenuClose}
              to={appLink.properties()}
            >
              Properties
            </SideNavMenuItem>
            <SideNavMenuItem
              activeClassName={ACTIVE_CLASS_NAME}
              element={NavLink}
              onClick={onMenuClose}
              to={appLink.quotas()}
            >
              Quotas
            </SideNavMenuItem>
            <SideNavMenuItem
              large
              activeClassName={ACTIVE_CLASS_NAME}
              element={NavLink}
              onClick={onMenuClose}
              to={appLink.taskTemplates()}
            >
              Task Manager
            </SideNavMenuItem>
          </SideNavMenu>
        ) : (
          <></>
        )}
      </SideNavItems>
    </SideNav>
  </LeftSideNav>
);

const skipToContentProps = {
  href: "#content",
};

interface NavbarContainerProps {
  handleOnTutorialClick(): void;
  navigationQuery: QueryResult<{ platform: { platformName: string } }, Error>;
  userQuery: QueryResult<FlowUser, Error>;
}

export default function NavbarContainer({ handleOnTutorialClick, navigationQuery, userQuery }: NavbarContainerProps) {
  const isStandaAloneMode = useFeature(FeatureFlag.Standalone);
  const defaultUIShellProps = {
    baseLaunchEnvUrl: isStandaAloneMode ? null : BASE_LAUNCH_ENV_URL,
    baseServiceUrl: isStandaAloneMode ? null : BASE_URL,
    requirePlatformConsent: isStandaAloneMode ? false : true,
    renderLogo: true,
  };

  const isAtLeastOperator = userQuery.data?.type === UserType.Admin || userQuery.data?.type === UserType.Operator;
  return (
    <>
      <Helmet>
        <title>{`Flow | ${navigationQuery.data?.platform?.platformName ?? "Boomerang"}`}</title>
      </Helmet>
      <UIShell
        {...defaultUIShellProps}
        onMenuClick={handleOnMenuClick(isAtLeastOperator, isStandaAloneMode)}
        headerConfig={navigationQuery.data}
        onTutorialClick={handleOnTutorialClick}
        user={userQuery.data}
        skipToContentProps={skipToContentProps}
      />
    </>
  );
}