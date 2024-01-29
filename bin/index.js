#!/usr/bin/env node

import fs from "fs";
import path from "path";
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
			describe: 'Path of file to run | command',
			type: 'string',
		})
		.usage('Usage: cry run [fileName | command]')
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
		await fs.promises.appendFile(filePath, '\n${text}', 'utf-8');
		console.log('Appended to file')
	}
};

async function printDirectoryContents(directoryPath, indentationLevel = 0) {
  const directoryEntries = await fs.promises.readdir(directoryPath);

  for (const directoryEntry of directoryEntries) {
    const filePath = path.join(directoryPath, directoryEntry);
    const isDirectory = await fs.promises.lstat(filePath).then((stats) => stats.isDirectory());

    console.log('${" ".repeat(indentationLevel)}- ${directoryEntry}');

    if (isDirectory) {
      await printDirectoryContents(filePath, indentationLevel + 1);
    }
  }
};

const readDirectory = async (directory, current) => {
	if (!directory && !current) { return }
	else if (directory && !current){
		printDirectoryContents(directory)	
	} else if (current && !directory) {
		printDirectoryContents(process.cwd())
	} else {
		throw(new Error('Error: pass either id or first option for read command'));
	}
};

const runCode = async (fileName) => {
	if (!fileName) { return }
	else if (fileName.substring(0,4) === 'next') {	
		switch (fileName) {
			case "next-create":
				execSync('npx create-next-app@latest .', {stdio: 'inherit'});
				break;
			case "next-dev":
				execSync('npm run dev', {stdio: 'inherit'});
				break;
			case "next-build":
				execSync('npm run build', {stdio: 'inherit'});
				break;
			default:
				console.log("Unsupported next command.");
				process.exit(1);	
		}
	}	
	
	else if (fileName.substring(0,4) === 'serve') {
		switch (fileName) {
			case "serve":
				execSync('npx serve', {stdio: 'inherit'});
				break;

			default:
				console.log("That is not how you serve HTML files");
				break;
		}
	}

	else if(fileName.includes(".")) {
		const extension = fileName.split(".").pop();
		
		switch (extension) {
			case "rs":
				execSync('cargo run ${fileName}', {stdio: 'inherit'});
				break;
			case "java":
				execSync('java -cp . ${fileName}', {stdio: 'inherit'});
				break;
			case "js":
				execSync('node ${fileName}', {stdio: 'inherit'});
				break;
			case "py":
				execSync('python ${fileName}', {stdio: 'inherit'});
				break;
			case "dart":
				execSync('dart run ${fileName}', {stdio: 'inherit'});
				break;
			default:
				console.log(`Unsupported file type of ${extension}`);
				console.log(`Unsupported file type of .${extension}`);
				process.exit(1);
		}
	}
};

if (argv._[0] === "run") {
	await runCode(argv.fileName);
} else {
	writeTextToFile(argv.filePath, argv.text, argv.append);
	readDirectory(argv.directory, argv.current);  
}

yargs.argv;
