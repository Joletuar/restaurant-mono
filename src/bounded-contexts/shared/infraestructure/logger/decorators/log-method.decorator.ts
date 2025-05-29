import dependencyContainer from '@src/apps/restaurant-api/dependencies';
import {
  type Logger,
  LogLevel,
} from '@src/bounded-contexts/shared/domain/logger.interface';

type Props = {
  level: LogLevel;
  entryMessage?: string;
  exitMessage?: string;
  logParams?: boolean;
  logResult?: boolean;
  filterParams?: string[];
};

export const LogMethod = (props: Props) => {
  const {
    entryMessage = 'Executing method',
    exitMessage = 'Method excuted',
    logParams = false,
    logResult = false,
    level = LogLevel.INFO,
    filterParams = [],
  } = props;

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // Obtenemos el metodo original
    const originalMethod = descriptor.value;

    // Decoramos el metodo con el logger
    descriptor.value = async function (...args: any[]) {
      const logger = dependencyContainer.resolve<Logger>('Logger');

      const logData: Record<string, any> = {
        class: target.constructor.name,
        method: propertyKey,
        args,
      };

      // Filtramos los parametros especificados
      if (
        filterParams.length > 0 &&
        logParams &&
        args.length > 0 &&
        level !== LogLevel.DEBUG
      ) {
        const objectArgs = args.filter((arg) => typeof arg === 'object');

        filterParams.forEach((param) => {
          objectArgs.forEach((arg) => {
            if (param in arg) {
              const argIndex = args.indexOf(arg);

              if (argIndex !== -1) {
                logData['args'][argIndex] = {
                  ...args,
                  [param]: 'FILTERED',
                };
              }
            }
          });
        });
      }

      // Log inicial al llamar el metodo
      logger[level](
        logData,
        `[📄] ${entryMessage} ${target.constructor.name}.${propertyKey}`
      );

      try {
        // Ejecutamos el metodo original
        const result = await originalMethod.apply(this, args);

        // Log al salir del método exitosamente
        if ((logResult && result !== undefined) || result !== null) {
          logger[level](
            { ...logData, result },
            `[✅] ${exitMessage} ${target.constructor.name}.${propertyKey}`
          );
        } else {
          logger[level](
            { ...logData, result },
            `[✅] ${exitMessage} ${target.constructor.name}.${propertyKey}`
          );
        }

        return result;
      } catch (error) {
        logger[level](
          error,
          `[❎] ${exitMessage} ${target.constructor.name}.${propertyKey}`
        );

        // Propagamos el error para que siga el flujo normal
        throw error;
      }
    };

    return descriptor;
  };
};
