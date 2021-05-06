import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import { ICliOptions } from "./constants";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import mkdirp from "mkdirp";

const access = promisify(fs.access);
const copy = promisify(ncp);

/**
 * initialize the project structure
 * @param dirPath The path to the directory
 */
async function initializeFolder(dirPath: string) {
  // Create server folder
  await mkdirp(path.resolve(process.cwd(), dirPath, "server"));

  // Go one step back and create client
  await mkdirp(path.resolve(process.cwd(), dirPath, "../client"));
}

/**
 * Copy Files from our template to your project
 * @param templateDirectory {String} the templateDirectory
 * @param targetDirectory {String} the targetDirectory
 * @returns {Promise<Error | void>} if successful, returns void, else returns an Error.
 */
async function copyTemplateFiles(
  templateDirectory: string,
  targetDirectory: string
): Promise<Error | void> {
  return copy(templateDirectory, targetDirectory, {
    clobber: false
  });
}

/**
 * Initialize git if asked
 * @param dirPath {String} the path to the directory
 * @returns {Promise<Error | void>} if successful, returns void, else returns an Error.
 */
async function initGit(dirPath: string): Promise<Error | void> {
  const result = await execa("git", ["init"], {
    cwd: dirPath
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
async function handleErrors(handler: () => Promise<any>, errorMessage: string) {
  try {
    await handler();
  } catch (err) {
    console.error(`%s Error: ${errorMessage}`, chalk.red.bold("ERROR"));
    process.exit(1);
  }
}

/**
 * Create the Full Stack project
 * @param options {ICliOptions} options received from input and after parsing defaults
 * @returns {Promise<boolean>} if project setup is successful, returns true, else returns false
 */
export async function createProject(options: ICliOptions): Promise<boolean> {
  const templateDir = path.resolve(__dirname, "../templates");

  const apiType = options.apiType!.toString().toLowerCase();
  const databaseType = options.database!.toString().toLowerCase();
  const clientType = options.client!.toString().toLowerCase();

  const serverTemplateDir = path.join(
    templateDir,
    apiType,
    "server",
    databaseType
  );
  const clientTemplateDir = path.join(
    templateDir,
    apiType,
    "client",
    `client-${clientType}`
  );

  const targetDirectory =
    path.resolve(process.cwd(), options.targetDirectory) || process.cwd();

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: "Initialize structure of project",
      task: () =>
        handleErrors(
          () => initializeFolder(targetDirectory),
          "Failed to create project directory"
        )
    },
    {
      title: "Copy server files",
      task: () =>
        handleErrors(
          () =>
            copyTemplateFiles(serverTemplateDir, `${targetDirectory}/server`),
          "Failed to Copy files"
        )
    },
    {
      title: "Install server dependencies",
      task: () =>
        handleErrors(
          () =>
            projectInstall({
              cwd: serverTemplateDir
            }),
          "Failed to install server dependencies"
        )
    },
    {
      title: "Copy client files",
      task: () =>
        handleErrors(
          () =>
            copyTemplateFiles(clientTemplateDir, `${targetDirectory}/client`),
          "Failed to copy client files"
        )
    },
    {
      title: "Install client dependencies",
      task: () =>
        handleErrors(
          () =>
            projectInstall({
              cwd: clientTemplateDir
            }),
          "Failed to install client dependencies"
        )
    },
    {
      title: "Initialize git",
      task: () =>
        handleErrors(
          () => initGit(targetDirectory),
          "Failed to initialize git"
        ),
      enabled: () => options.git
    }
  ]);

  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
