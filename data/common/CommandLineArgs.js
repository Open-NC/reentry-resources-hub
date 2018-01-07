class CommandLineArgs {
  constructor(args) {
    this.args = [];
    this.options = {};
    args.forEach(arg => {
      if (arg.startsWith('--')) {
        const eqIndex = arg.indexOf('=');
        if (eqIndex >= 0) {
          const optName = arg.substring(2, eqIndex);
          const optValue = arg.substring(eqIndex + 1);
          this.options[optName] = optValue;
        } else {
          const optName = arg.substring(2);
          this.options[optName] = true;
        }
      } else {
        this.args.push(arg);
      }
    });
  }

  getOption(name, defaultValue = null) {
    return (name in this.options) ? this.options[name] : defaultValue;
  }

  hasOption(name) {
    return (name in this.options);
  }

  getArg(argNum) {
    return (this.args.length > argNum) ? this.args[argNum] : null;
  }

  argCount() {
    return this.args.length;
  }
}

module.exports = CommandLineArgs;
