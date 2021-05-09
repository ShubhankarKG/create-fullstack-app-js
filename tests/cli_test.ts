import "mocha"
import chai from "chai";
import { parseArgumentsIntoOptions } from "../src/cli";
const expect = chai.expect

describe('cli/parseArgumentsIntoOptions', () => {

    it("parses string array correctly", () => {
        const arg = "some-file --git";
        const argv = arg.split(" ");

        const { git, targetDirectory, skipPrompts } = parseArgumentsIntoOptions(
            ["nodejs_path", "process-name", ...argv]
        );
        expect(git).to.be.true;
        expect(targetDirectory).to.equal("some-file");
        expect(skipPrompts).to.be.false;
    });

    it("adds default value correctly", () => {
        const arg = "";
        const argv = arg.split(" ");

        const { git, targetDirectory, skipPrompts } = parseArgumentsIntoOptions(
            ["nodejs_path", "process-name", ...argv]
        );
        expect(git).to.be.false;
        expect(targetDirectory).to.equal(".");
        expect(skipPrompts).to.be.false;
    });

    it("parses alias correctly", () => {
        const arg = "some-file -g -y";
        const argv = arg.split(" ");

        const { git, skipPrompts } = parseArgumentsIntoOptions(
            ["nodejs_path", "process-name", ...argv]
        );
        expect(git).to.be.true;
        expect(skipPrompts).to.be.true;
    });
})
