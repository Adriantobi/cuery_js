#!/usr/bin/env node

import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { execSync } from "child_process";

const argv = yargs(hideBin(process.argv))
	.usage("Usage: $0 <command>")
	.command('list', 'List items in project', function (yargs) {
		yargs.option({
			directory: {
				alias: 'd',
				type: 'string',
				description: 'Directory path to display'
			},
			current: {
				alias: 'c',
				type: 'boolean',
				default: false,
				description: 'Display current directory',
			},
		})
		.implies('current', 'directory')
		.usage('Usage: cry list [-d, directory] | [-c, current]')
	})
	.command('write', 'Write text to a file', function (yargs) {
		yargs.options({
			filePath: {
				alias: 'fp',
				type: 'string',
				demandOption: true,
				description: 'File path of file to write',
			},
			text: {	
				alias: 't',
				type: 'string',
				demandOption: true,
				description: 'Text to write',
			},
			append: {
				alias: 'a',
				type: 'boolean',
				default: false,
				description: 'Append instead of overwriting',
			},
		})
		.usage('Usage: cry write [--fp, filePath] [-t, text] | [-a, append]')
	})
	.command('run [fileName]', 'Run Code', function (yargs) {
		yargs.positional('fileName',{
			describe: 'Path of file to run',
			type: 'string',
		})
		.usage('Usage: cry run [fileName]')
	})
	.alias({
        	help: 'h',
        	version: 'v'
	})
	.help()
	.showHelpOnFail(true)
	.demandCommand(1, '')
	.argv;

const writeTextToFile = async (filePath, text, append) => {
	if (!filePath) { return }
	if (!append) {
		await fs.promises.writeFile(filePath, text, 'utf-8');
		console.log('Written to file')
	} else {
		await fs.promises.appendFile(filePath, `\n${text}`, 'utf-8');
		console.log('Appended to file')
	}
};

const readDirectory = async (directory, current) => {
	if (!directory && !current) { return }
	else if (directory && !current){
		const files = await fs.promises.readdir(directory);
		files.forEach((file) => {
			console.log(file);
		});
	} else if (current && !directory) {
		const files = await fs.promises.readdir(process.cwd());
		files.forEach((file) => {
			console.log(file);
		})
	} else {
		console.log('Silly, you can\'t have both')
	}
};

const runCode = async (fileName) => {
	if (!fileName) { return }
	console.log('Running code in file ' + fileName)
	const extension = fileName.split(".").pop();

	switch (extension) {
		case "rs":
			execSync(`cargo run ${fileName}`, {stdio: 'inherit'});
			break;
		case "java":
			execSync(`java -cp . ${fileName}`, {stdio: 'inherit'});
			break;
		case "js":
			execSync(`node ${fileName}`, {stdio: 'inherit'});
			break;
		case "py":
			execSync(`python ${fileName}`, {stdio: 'inherit'});
			break;
		case "dart":
			execSync(`dart run ${fileName}`, {stdio: 'inherit'});
			break;
		default:
			console.log("Unsupported file type of ." + extension);
			process.exit(1);
	}
};


if (argv._[0] === "run") {
	await runCode(argv.fileName);
} else {
	writeTextToFile(argv.filePath, argv.text, argv.append);
	readDirectory(argv.directory, argv.current);
  
}

yargs.arg;
