export class InvalidPathParameter extends Error {
  constructor(parameter: string) {
    super(`Parameter <${parameter}> is not valid`);

    this.name = 'InvalidPathParameter';
  }
}
