import arg from "arg";
import inquirer from "inquirer";
import { DefaultOptions, ICliOptions } from "./constants";
import { createProject } from "./main";

/**
 * Parse Command Line Arguments into options
 * @param rawArgs {Array<string>} The command-line arguments
 * @returns {ICliOptions} The command line arguments parsed into ICliOptions interface
 */
function parseArgumentsIntoOptions(rawArgs: string[]): ICliOptions {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "--no-client": Boolean
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    targetDirectory: args._[0] || "."
  };
}

/**
 *
 * @param options {ICliOptions} The Command Line arguments parsed into ICliOptions
 * @returns {Promise<ICliOptions>} refined, and all fields filled into ICliOptions
 */
async function promptForMissingOptions(
  options: ICliOptions
): Promise<ICliOptions> {
  const { apiType, database, client } = DefaultOptions;

  if (options.skipPrompts) {
    return { ...options, apiType, database, client };
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const questions: Array<inquirer.QuestionCollection<any>> = [];
  if (!options.apiType) {
    questions.push({
      type: "list",
      name: "apiType",
      message: "Please choose which project API pattern to use? ",
      choices: ["rest", "graphql"],
      default: apiType
    });
  }

  if (!options.database) {
    questions.push({
      type: "list",
      name: "database",
      message: "Please choose which database to use? ",
      choices: ["MongoDB", "Firebase", "PostgreSQL", "MySQL"],
      default: database
    });
  }

  if (!options.client) {
    questions.push({
      type: "list",
      name: "client",
      message: "Please choose which client to configure? ",
      choices: ["React", "Angular", "Vue"],
      default: client
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    git: options.git || answers.git,
    apiType: answers.apiType,
    database: answers.database,
    client: answers.client
  };
}

/**
 * The CLI Function
 * @param args The Command Line Arguments
 */
export async function cli(args: string[]): Promise<void> {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
