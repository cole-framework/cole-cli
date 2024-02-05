# Cole CLI Tool

**This is still WIP**

Welcome to the Cole CLI Tool, a powerful command-line interface designed to streamline the development of web applications using the principles of Clean Architecture. Built with flexibility in mind, this tool supports the Cole framework, enabling developers to quickly scaffold new projects or enhance existing ones across various programming languages and web frameworks.

## Features

- **Project Initialization**: Quickly bootstrap new web application projects with a structure that adheres to Clean Architecture principles.
- **Component Generation**: Effortlessly create components such as entities, use cases, repositories, controllers, and more, without the need for manual boilerplate code.
- **Cross-Language Support**: Initiate projects in your chosen programming language, offering versatility and support for a wide range of web frameworks.
- **Seamless Integration**: Integrate with existing projects to add new components or features, enhancing your application without the need for project reinitialization.

## Getting Started

To get started with the Cole CLI Tool, ensure you have it installed on your system. You can install the CLI tool using the following command:

```bash
# Replace <version> with the actual version you wish to install
npm install -g @cole-framework/cole-cli@<version>
```

### Creating a New Project

To create a new project, use the `cole new project` command followed by your project name and the desired language and framework options:

```bash
cole new project "MyWebApp" --lang "TypeScript" --framework "Express" --database "mongo,mysql"
```

This command will scaffold a new web application project using the Express framework in JavaScript, structured according to Clean Architecture principles.

### Adding Components to Your Project

To add new components to your project, navigate to your project directory and use the component generation commands provided by the CLI. For example, to add a new entity:

```bash
cole add entity "User" --props "name:string, email:string"
```

This command will generate a new User entity with the specified properties.

## Documentation

For detailed documentation on all commands and options available in the Cole CLI Tool, refer to the official documentation or use the help command:

```bash
cole --help
```

## Contributing

Contributions to the Cole CLI Tool are welcome! If you have suggestions for improvements or encounter any issues, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.