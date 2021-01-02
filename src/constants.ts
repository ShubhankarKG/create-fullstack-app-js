export interface IOptions {
  skipPrompts: boolean;
  git: boolean;
  apiType?: "rest" | "graphql";
  database?: string;
  client?: "react" | "vue" | "angular";
  targetDirectory: string;
  templateDirectory?: string;
  runInstall?: boolean;
}
