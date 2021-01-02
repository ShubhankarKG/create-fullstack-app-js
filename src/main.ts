import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import { IOptions } from "./constants";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options: IOptions) {
  return copy(
    options.templateDirectory as string,
    options.targetDirectory as string,
    {
      clobber: false,
    }
  );
}

async function initGit(options: IOptions): Promise<Error | void> {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}

export async function createProject(options: IOptions): Promise<boolean> {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };
  console.log(options)
  let templateDir = path.resolve(__dirname, "../templates");

  const apiType = options.apiType?.toLowerCase();
  const databaseType = options.database;
  if (apiType === "rest") {
    templateDir = path.join(templateDir, "rest");
  } else if (apiType === "graphql") {
    templateDir = path.join(templateDir, "graphql");
  }

  if (databaseType == "MongoDB") {
    templateDir = path.join(templateDir, "server", "oodbms");
  } else {
    templateDir = path.join(templateDir, "rdbms");
  }
  console.log(templateDir);
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
    },
  ]);

  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
