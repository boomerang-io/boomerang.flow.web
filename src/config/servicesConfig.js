import portForwardMap from "../setupPortForwarding";
import axios, { CancelToken } from "axios";

export const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : window._SERVER_DATA && window._SERVER_DATA.BASE_SERVICE_ENV_URL;

export const PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : window._SERVER_DATA && window._SERVER_DATA.PRODUCT_SERVICE_ENV_URL;

const REACT_APP_PORT_FORWARD = process.env.REACT_APP_PORT_FORWARD;

/**
 * if port forwarding is enabled, then check to see if service is in config map
 * If it is, set the url request to be only the serviceContextPath
 * CRA will proxy the request as seen in setupProxy.js
 * @param {string} baseUrl - base of the serivce url
 * @param {sring} serviceContextPath - additional path for the service context e.g. /admin
 */
function determineUrl(baseUrl, serviceContextPath) {
  if (REACT_APP_PORT_FORWARD && portForwardMap[serviceContextPath]) {
    return serviceContextPath;
  } else {
    return baseUrl + serviceContextPath;
  }
}

// Standard
export const BASE_URL = BASE_SERVICE_ENV_URL;
export const BASE_SERVICE_URL = determineUrl(PRODUCT_SERVICE_ENV_URL, "/flow");
export const BASE_USERS_URL = determineUrl(BASE_SERVICE_ENV_URL, "/users");
export const BASE_TEAMS_URL = `${BASE_SERVICE_URL}/teams`;

// Profile image
export const IMG_URL = `${BASE_USERS_URL}/image`;

// Teams
export const TEAMS_USER_URL = email => `${BASE_TEAMS_URL}?userEmail=${email}`;
export const TEAM_PROPERTIES_ID_URL = ciTeamId => `${BASE_TEAMS_URL}/${ciTeamId}/properties`;
export const TEAM_PROPERTIES_ID_PROPERTY_ID_URL = (ciTeamId, configurationId) =>
  `${BASE_TEAMS_URL}/${ciTeamId}/properties/${configurationId}`;

export const HTTP_METHODS = {
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  GET: "get"
};

export const serviceUrl = {
  getTaskTemplates: () => `${BASE_SERVICE_URL}/tasktemplate`,
  deleteArchiveTaskTemplate: ({ id }) => `${BASE_SERVICE_URL}/tasktemplate/${id}`,
  restoreTaskTemplate: ({ id }) => `${BASE_SERVICE_URL}/tasktemplate/${id}/activate`
};

export const cancellableResolver = ({ url, method, body, ...config }) => {
  // Create a new CancelToken source for this request
  const source = CancelToken.source();
  const promise = axios({
    ...config,
    method,
    url,
    data: body,
    cancelToken: source.token
  });
  return { promise, cancel: () => source.cancel("cancel") };
};

export const resolver = {
  query: url => () => axios.get(url).then(response => response.data),
  postMutation: request => axios.post(request),
  patchMutation: request => axios.patch(request),
  putMutation: request => axios.put(request),
  deleteArchiveTaskTemplate: ({ id }) => axios.delete(serviceUrl.deleteArchiveTaskTemplate({ id })),
  postAddService: ({ body }) =>
    cancellableResolver({ url: serviceUrl.postAddService(), body, method: HTTP_METHODS.POST }),
  postCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates(), body, method: HTTP_METHODS.POST }),
  putCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates(), body, method: HTTP_METHODS.PUT }),
  putRestoreTaskTemplate: ({ id }) => axios.put(serviceUrl.restoreTaskTemplate({ id }))
};

export const REQUEST_STATUSES = {
  FAILURE: "failure",
  SUCCESS: "success"
};
