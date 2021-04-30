enum DatabaseTypes {
  MongoDB = "mongodb",
  Firebase = "firebase",
  PostgreSQL = "postgresql",
  MySQL = "mysql"
}

enum ClientTypes {
  React = "react",
  Vue = "vue",
  Angular = "angular"
}

enum APITypes {
  REST = "rest",
  GraphQL = "graphql"
}

export interface ICliOptions {
  skipPrompts: boolean;
  git: boolean;
  targetDirectory: string;
  runInstall?: boolean;
  apiType?: APITypes;
  database?: DatabaseTypes;
  client?: ClientTypes;
}

export const DefaultOptions = {
  apiType: APITypes.REST,
  database: DatabaseTypes.MongoDB,
  client: ClientTypes.React
}

export interface IOptions {
  skipPrompts: boolean;
  git: boolean;
  apiType?: "rest" | "graphql";
  database?: "mongodb" | "firebase" | "postgresql" | "mysql";
  client?: "react" | "vue" | "angular";
  targetDirectory: string;
  templateDirectory?: string;
  runInstall?: boolean;
}
