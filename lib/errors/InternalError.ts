import chalk from 'chalk'

const MESSAGE = chalk.supportsColor ? chalk.reset.inverse.bold.redBright(` INTERNAL ERROR `) : ' INTERNAL ERROR '

class InternalError extends Error {
  constructor(text: string) {
    super(text)

    this.name = MESSAGE
  }
}

export default InternalError