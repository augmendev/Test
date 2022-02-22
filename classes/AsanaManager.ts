interface AsanaManager {
  token: string;
  workspace: string;
  baseUrl: string;
  headers: { Authorization: string; "Content-Type": string };
}

class AsanaManager {
  constructor(config: AsanaManagerTypes.Config) {
    this.token = config.token;
    this.workspace = config.workspace;
    this.baseUrl = "https://app.asana.com/api/1.0";
    this.headers = this.createHeaders();
  }

  addAttachmentToTask(
    taskId: string,
    attachmentBlob: GoogleAppsScript.Base.Blob
  ) {
    const { baseUrl } = this;
    const payload = {
      file: attachmentBlob,
    };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: { Authorization: this.headers.Authorization },
      payload: payload,
      muteHttpExceptions: true,
    };
    const url = `${baseUrl}/tasks/${taskId}/attachments`;
    return this.callAsana(url, options);
  }

  addProjectToTask(
    taskId: string,
    payload: AsanaManagerTypes.addProjectToTaskPayload
  ) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/tasks/${taskId}/addProject`;
    headers["Content-Type"] = "application/json";
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: headers,
      payload: JSON.stringify({ data: payload }),
      muteHttpExceptions: true,
    };
    return this.callAsana(url, options);
  }

  /**
   * @param {array} members Array of id strings
   * @param {boolean} addMembers
   * @param {boolean} addFollowers
   * @param {string} id task or project id
   * @param {string} resource task or project
   */
  addUsers({ users, type, id, resource }: AsanaManagerTypes.AddUsersOptions) {
    if (!users.length) return;
    const { headers, baseUrl } = this;
    const payload = {
      data: {
        members: users.join(","),
      },
    };
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };
    const url = `${baseUrl}/${resource}/${id}/${type}`;
    return this.callAsana(url, options);
  }

  buildQuery(params: { [key: string]: string | number }) {
    const queryStrings = [];
    for (let key in params) {
      queryStrings.push(`${key}=${params[key]}`);
    }
    return queryStrings.length ? "?" + queryStrings.join("&") : "";
  }

  callAsana(
    url: string,
    options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
  ) {
    const response = UrlFetchApp.fetch(url, options);
    try {
      const json = JSON.parse(response.getContentText());
      return json;
    } catch (err) {
      Logger.log(err);
    }
  }

  createHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }
  // TODO: add type for create subtask payload
  createSubtask(taskId: string, payload: { data: { [key: string]: any } }) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/tasks/${taskId}/subtasks`;
    headers["Content-Type"] = "application/json";
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };
    return this.callAsana(url, options);
  }

  createTask(payload: AsanaManagerTypes.PostTaskPayload) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/tasks`;
    headers["Content-Type"] = "application/json";
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };
    return this.callAsana(url, options);
  }

  duplicateProject(
    originalId: string,
    payload: AsanaManagerTypes.PostProjectPayload
  ) {
    const { buildQuery, workspace, headers, baseUrl } = this;
    const url = `${baseUrl}/projects/${originalId}/duplicate`;
    headers["Content-Type"] = "application/json";
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: headers,
      payload: JSON.stringify({ data: payload }),
      muteHttpExceptions: true,
    };
    return this.callAsana(url, options);
  }

  duplicateTask(
    originalId: string,
    payload: AsanaManagerTypes.DuplicateTaskPayload
  ) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/tasks/${originalId}/duplicate`;
    headers["Content-Type"] = "application/json";
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: headers,
      payload: JSON.stringify({ data: payload }),
      muteHttpExceptions: true,
    };
    return this.callAsana(url, options);
  }

  getAllUsers() {
    const { workspace, headers, baseUrl } = this;
    const url = `${baseUrl}/users?workspace=${workspace}&opt_fields=name,email`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true,
    };

    const allUsersResponse = this.callAsana(
      url,
      options
    ) as AsanaManagerTypes.GetAllUsersResponse;

    return allUsersResponse;
  }

  getAllTasksByUser(userId: string) {
    const { workspace, headers, buildQuery, baseUrl } = this;
    const today = new Date();
    // const checkSince = daysAgo(nDaysAgo, today); TODO: Add this function back in
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true,
    };
    const queryParams = {
      workspace: workspace,
      assignee: userId,
      // completed_since: checkSince.toISOString(),  TODO: Add this function back in
      opt_fields:
        "name," +
        "memberships.project," +
        "memberships.project.name," +
        "memberships.section,memberships.section.name," +
        "due_on," +
        "created_at," +
        "completed",
    };
    const query = buildQuery(queryParams);
    const url = `${baseUrl}/tasks${query}`;
    return this.callAsana(url, options);
  }

  getSectionsFromProject(projectId: string) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/projects/${projectId}/sections`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true,
    };
    return this.callAsana(url, options);
  }

  getStories(id: string) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/tasks/${id}/stories`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true,
    };
    return this.callAsana(url, options);
  }

  getTask(id: string) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/tasks/${id}`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
    };
    return this.callAsana(url, options);
  }

  getTasksFromProject(
    id: string,
    extraParams: { [key: string]: string | number }
  ) {
    const { headers, baseUrl, buildQuery } = this;
    const url = `${baseUrl}/projects/${id}/tasks${buildQuery(extraParams)}`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
    };
    return this.callAsana(url, options);
  }

  getUnfinishedTasksByUser(userId: string) {
    const { workspace, headers, buildQuery, baseUrl } = this;
    const today = new Date();
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
    };
    const queryParams = {
      workspace: workspace,
      assignee: userId,
      completed_since: today.toISOString(),
      opt_fields:
        "name," +
        "memberships.project," +
        "memberships.project.name," +
        "memberships.section,memberships.section.name," +
        "due_on," +
        "custom_fields",
    };
    const query = buildQuery(queryParams);
    const url = `${baseUrl}/tasks${query}`;
    return this.callAsana(url, options);
  }

  updateProject(
    projectId: string,
    payload: AsanaManagerTypes.PostProjectPayload
  ) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/projects/${projectId}`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "put",
      headers: headers,
      payload: JSON.stringify(payload),
    };
    return this.callAsana(url, options);
  }

  /**
   * @param {array} members Array of id strings
   * @param {boolean} addMembers
   * @param {boolean} addFollowers
   * @param {string} id task or project id
   * @param {string} resource task or project
   */
  removeUsers({
    users,
    id,
    resource,
    type,
  }: AsanaManagerTypes.RemoveUsersOptions) {
    if (!users.length) return;
    //    const type = removeMembers ? 'removeMembers' : 'removeFollowers'
    const { headers, baseUrl } = this;
    const payload = {
      data: {
        followers: users.join(","),
      },
    };
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };
    const url = `${baseUrl}/${resource}/${id}/${type}`;
    return this.callAsana(url, options);
  }

  updateTask(taskId: string, payload: AsanaManagerTypes.PostTaskPayload) {
    const { headers, baseUrl } = this;
    const url = `${baseUrl}/tasks/${taskId}`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "put",
      headers: headers,
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };
    // Logger.log(JSON.stringify(payload));
    return this.callAsana(url, options);
  }
}
