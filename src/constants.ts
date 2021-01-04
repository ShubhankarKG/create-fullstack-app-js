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
