## Cuery

### Overview
Introducing 'cuery' pronounced as query: The CLI magician that effortlessly writes, lists, and runs code with a dash of command-line wizardry. Simplify your tasks, write text to files, explore directories, and run code with ease, all in one compact tool.

### Requirements
- You must have node installed

### Install
```shell
npm i -g cuery_js
```

- This globally installs the package.

### How to use
- To use the cuery CLI tool, simply run the following command:
```shell
cry <command> [options]
```
- Yes cry, I do every night
- The command argument specifies the task that you want to perform. The options arguments are used to configure the command.

#### Examples
Here are some examples of how to use the cry CLI tool:

```shell
cry list -c
```
- This returns all the files in the current directory

```shell
cry run test.dart
```
- Runs code 

```shell
cry run next-create
```
- Create next app

```shell
cry run next-dev
```
- Run next app in localhost

```shell
cry run next-build
```
- Build next app

```shell
cry write --fp=test.txt -t="Please append" -a
```
- Append text to file

#### Supported Languages
The following languages are supported with ``cry run``
- Dart
- Java
- JavaScript
- Rust
- Python
- NextJs

### Conclusion
The cuery CLI tool is a simple and easy-to-use tool for performing common tasks such as listing items in a project, writing text to a file, and running code. It is a good choice for developers and beginners alike.
