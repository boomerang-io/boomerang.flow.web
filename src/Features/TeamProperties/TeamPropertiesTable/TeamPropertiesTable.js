import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, queryCache } from "react-query";
import {
  ComboBox,
  DataTable,
  Error,
  Error404,
  Pagination,
  DataTableSkeleton,
  notify,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditTeamPropertiesModal from "./CreateEditTeamPropertiesModal";
import ActionsMenu from "./ActionsMenu";
import Header from "Components/Header";
import { InputType } from "Constants";
import { formatErrorMessage } from "@boomerang-io/utils";
import { arrayPagination } from "Utils/arrayHelper";
import { stringToPassword } from "Utils/stringHelper";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { Checkmark32, Close32 } from "@carbon/icons-react";
import styles from "./teamPropertiesTable.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 25, 50];
const headers = [
  {
    header: "Label",
    key: "label",
  },
  {
    header: "Key",
    key: "key",
  },
  {
    header: "Description",
    key: "description",
  },
  {
    header: "Value",
    key: "value",
  },
  {
    header: "Secured",
    key: "secured",
  },
  {
    header: "",
    key: "actions",
  },
];

TeamPropertiesTable.propTypes = {
  activeTeam: PropTypes.object,
  properties: PropTypes.array.isRequired,
  propertiesAreLoading: PropTypes.bool,
  propertiesError: PropTypes.object,
  setActiveTeam: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
};

function TeamPropertiesTable({ activeTeam, properties, propertiesAreLoading, propertiesError, setActiveTeam, teams }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState({ key: "label", sortDirection: "ASC" });

  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: activeTeam?.id });

  /** Delete Team Property */
  const [deleteTeamPropertyMutation] = useMutation(resolver.deleteTeamPropertyRequest, {
    onSuccess: () => queryCache.invalidateQueries([teamPropertiesUrl]),
  });

  const deleteTeamProperty = async (component) => {
    try {
      await deleteTeamPropertyMutation({ teamId: activeTeam.id, configurationId: component.id });
      notify(
        <ToastNotification
          kind="success"
          title={"Team Configuration Deleted"}
          subtitle={`Request to delete ${component.label} succeeded`}
          data-testid="delete-team-prop-notification"
        />
      );
    } catch (err) {
      const errorMessages = formatErrorMessage({ error: err, defaultMessage: "Delete Configuration Failed" });
      notify(
        <ToastNotification
          kind="error"
          title={errorMessages.title}
          subtitle={errorMessages.message}
          data-testid="delete-team-prop-notification"
        />
      );
    }
  };

  const handlePaginationChange = ({ page, pageSize }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const renderCell = (propertyId, cellIndex, value) => {
    const property = properties.find((property) => property.id === propertyId);
    const column = headers[cellIndex];
    switch (column.key) {
      case "value":
        const determineValue = value
          ? property && property.type === InputType.Password
            ? stringToPassword(value)
            : value
          : "---";
        return <p className={styles.tableTextarea}>{determineValue}</p>;
      case "secured":
        return property && property.type === InputType.Password ? (
          <Checkmark32 alt="secured" className={`${styles.tableSecured} ${styles.secured}`} />
        ) : (
          <Close32 alt="unsecured" className={`${styles.tableSecured} ${styles.unsecured}`} />
        );
      case "actions":
        return (
          <ActionsMenu
            team={activeTeam}
            property={property}
            properties={properties}
            deleteTeamProperty={deleteTeamProperty}
          />
        );
      default:
        return value || "---";
    }
  };

  const handleSort = (valueA, valueB, config) => {
    setSort(config);
  };

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
  const totalItems = properties.length;

  return (
    <>
      <Header
        includeBorder
        title="Team Properties"
        description="Set team properties that are accessible in all workflows for that team."
      />
      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div className={styles.dropdown}>
            <ComboBox
              data-testid="team-properties-combobox"
              id="team-properties-select"
              initialSelectedItem={activeTeam?.id ? activeTeam : null}
              items={teams}
              itemToString={(item) => item?.name ?? ""}
              label="Teams"
              onChange={({ selectedItem }) => {
                setActiveTeam(selectedItem);
              }}
              placeholder="Select a team"
              shouldFilterItem={({ item, inputValue }) => item?.name?.toLowerCase()?.includes(inputValue.toLowerCase())}
            />
          </div>
          {(activeTeam?.id || totalItems > 0) && (
            <CreateEditTeamPropertiesModal properties={properties} team={activeTeam} />
          )}
        </div>
        {propertiesAreLoading ? (
          <DataTableSkeleton />
        ) : propertiesError ? (
          <Error />
        ) : totalItems > 0 ? (
          <>
            <DataTable
              rows={arrayPagination(properties, page, pageSize, sort)}
              sortRow={handleSort}
              headers={headers}
              render={({ rows, headers, getHeaderProps }) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header, key) => (
                          <TableHeader
                            key={`mode-table-key-${key}`}
                            {...getHeaderProps({
                              header,
                              className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                            })}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody className={styles.tableBody}>
                      {rows.map((row) => {
                        return (
                          <TableRow key={row.id}>
                            {row.cells.map((cell, cellIndex) => (
                              <TableCell key={cell.id} style={{ padding: "0" }}>
                                <div className={styles.tableCell}>{renderCell(row.id, cellIndex, cell.value)}</div>
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            />
            <Pagination
              onChange={handlePaginationChange}
              page={page}
              pageSize={pageSize}
              pageSizes={PAGE_SIZES}
              totalItems={totalItems}
            />
          </>
        ) : (
          <>
            <DataTable
              rows={properties}
              headers={headers}
              render={({ headers }) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header, key) => (
                          <TableHeader
                            key={`no-team-config-table-key-${key}`}
                            className={`${styles.tableHeadHeader} ${styles[header.key]}`}
                          >
                            <span className="bx--table-header-label">{header.header}</span>
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              )}
            />
            <Error404 header={null} title="No team properties" message={null} />
          </>
        )}
      </div>
    </>
  );
}

export default TeamPropertiesTable;
