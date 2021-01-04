import arg from "arg";
import inquirer from "inquirer";
import { IOptions } from "./constants";
import { createProject } from "./main";

function parseArgumentsIntoOptions(rawArgs: string[]): IOptions {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "--no-client": Boolean,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    targetDirectory: args._[0] || ".",
  };
}

async function promptForMissingOptions(options: IOptions): Promise<IOptions> {
  const defaultAPIType = "rest";
  const defaultDatabase = "mongodb";

  if (options.skipPrompts) {
    return { ...options, apiType: defaultAPIType, database: defaultDatabase };
  }

  const questions: Array<inquirer.QuestionCollection<any>> = [];
  if (!options.apiType) {
    questions.push({
      type: "list",
      name: "apiType",
      message: "Please choose which project API pattern to use? ",
      choices: ["rest", "graphql"],
      default: defaultAPIType,
    });
  }

  if (!options.database) {
    questions.push({
      type: "list",
      name: "database",
      message: "Please choose which project API pattern to use? ",
      choices: ["MongoDB", "Firebase", "PostgreSQL", "MySQL"],
      default: defaultDatabase,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    git: options.git || answers.git,
    apiType: answers.apiType,
    database: answers.database,
  };
}

export async function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
