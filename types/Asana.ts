namespace AsanaManagerTypes {
  export interface Config {
    token: string;
    workspace: string;
  }

  export interface AddUsersOptions {
    users: string[];
    type: "addMembers" | "addFollowers";
    id: string;
    resource: "task" | "project";
  }

  export interface RemoveUsersOptions {
    users: string[];
    type: "removeMembers" | "removeFollowers";
    id: string;
    resource: "task" | "project";
  }

  export interface PostTaskPayload {
    data: TaskData;
  }
  export interface TaskData {
    approval_status?: string;
    assignee?: string;
    completed?: boolean;
    completed_by?: CompletedBy;
    custom_fields?: CustomFields;
    due_at?: string;
    due_on?: string;
    external?: External;
    followers?: string[] | null;
    html_notes?: string;
    liked?: boolean;
    name: string;
    notes?: string;
    parent?: string;
    projects?: string[] | null;
    resource_subtype?: string;
    start_on?: string;
    tags?: string[] | null;
    workspace?: string;
    memberships?: MembershipEntry[];
  }

  export interface DuplicateTaskPayload {
    name: string;
    include: string[];
    assignee?: string;
    followers?: string[];
  }

  export interface addProjectToTaskPayload {
    insert_after?: string;
    insert_before?: string;
    project: string;
    section?: string;
  }

  interface MembershipEntry {
    project?: string;
    section?: string;
  }
  export interface CompletedBy {
    name: string;
  }
  export interface CustomFields {
    [key: string]: string;
  }
  export interface External {
    data: string;
    gid: string;
  }

  export interface PostProjectPayload {
    data: ProjectData;
  }
  export interface ProjectData {
    archived?: boolean;
    color?: string;
    current_status?: CurrentStatus;
    custom_fields?: CustomFields;
    default_view?: string;
    due_date?: string;
    due_on?: string;
    followers?: string;
    html_notes?: string;
    is_template?: boolean;
    name: string;
    notes?: string;
    owner?: string;
    public?: boolean;
    start_on?: string;
    team?: string;
  }
  export interface CurrentStatus {
    author: AuthorOrCreatedBy;
    color: string;
    created_by: AuthorOrCreatedBy;
    html_text: string;
    modified_at?: null;
    text: string;
    title: string;
  }
  export interface AuthorOrCreatedBy {
    name: string;
  }

  export interface GetAllUsersEntry {
    gid: string;
    name: string;
    email: string;
  }

  export interface GetAllUsersResponse {
    data: GetAllUsersResponseDatum[];
  }
  
  interface GetAllUsersResponseDatum {
    gid: string;
    email: string;
    name: string;
  }
}

namespace AsanaConfig {
  export interface CustomField {
    [name: string]: CustomFieldEntity;
  }
  export interface CustomFieldEntity {
    id: string;
    options?: OptionsEntity[];
  }
  export interface OptionsEntity {
    gid: string;
    color: string;
    enabled: boolean;
    name: string;
    resource_type: string;
  }
}

