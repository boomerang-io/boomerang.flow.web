import React from "react";
import PropTypes from "prop-types";
import { LeftSideNav, UIShell } from "@boomerang/carbon-addons-boomerang-react";
import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import { BASE_URL } from "Config/servicesConfig";
import { NavLink } from "react-router-dom";
import { Activity16, ChartScatter16, FlowData16, SettingsAdjust16 } from "@carbon/icons-react";
import { SideNav, SideNavLink, SideNavItems, SideNavMenu, SideNavMenuItem } from "carbon-components-react";

const onMenuClick = ({ isOpen, onMenuClose }) => (
  <LeftSideNav isOpen={isOpen}>
    <SideNav ariaLabel="nav" expanded={isOpen} isChildOfHeader={true}>
      <SideNavItems>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={FlowData16}
          to="/workflows"
        >
          Workflows
        </SideNavLink>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={Activity16}
          to="/activity"
        >
          Activity
        </SideNavLink>
        <SideNavLink
          large
          activeClassName={"bx--side-nav__link--current"}
          element={NavLink}
          onClick={onMenuClose}
          renderIcon={ChartScatter16}
          to="/insights"
        >
          Insights
        </SideNavLink>
        <SideNavMenu large renderIcon={SettingsAdjust16} title="Manage">
          <SideNavMenuItem
            large
            activeClassName={"bx--side-nav__link--current"}
            element={NavLink}
            onClick={onMenuClose}
            to="/properties"
          >
            Properties
          </SideNavMenuItem>
          <SideNavMenuItem
            large
            activeClassName={"bx--side-nav__link--current"}
            element={NavLink}
            onClick={onMenuClose}
            to="/team-properties"
          >
            Team Properties
          </SideNavMenuItem>
        </SideNavMenu>
      </SideNavItems>
    </SideNav>
  </LeftSideNav>
);

const defaultUIShellProps = {
  baseLaunchEnvUrl: BASE_LAUNCH_ENV_URL,
  baseServiceUrl: BASE_URL,
  onMenuClick: onMenuClick,
  renderLogo: true
};

NavbarContainer.propTypes = {
  handleOnTutorialClick: PropTypes.func.isRequired,
  navigationState: PropTypes.object.isRequired,
  userState: PropTypes.object
};

function NavbarContainer({ handleOnTutorialClick, navigationState, userState }) {
  if (
    navigationState.status === SERVICE_REQUEST_STATUSES.SUCCESS &&
    userState.status === SERVICE_REQUEST_STATUSES.SUCCESS
  ) {
    return (
      <UIShell
        {...defaultUIShellProps}
        headerConfig={navigationState.data}
        onTutorialClick={handleOnTutorialClick}
        user={userState.data}
      />
    );
  }

  return <UIShell {...defaultUIShellProps} />;
}

export default NavbarContainer;
