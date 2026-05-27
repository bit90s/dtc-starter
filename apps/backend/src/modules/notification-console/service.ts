import type { Logger, NotificationTypes } from '@medusajs/framework/types';
import { AbstractNotificationProviderService } from '@medusajs/framework/utils';

type InjectedDependencies = {
  logger: Logger;
};

type Options = {
  prefix?: string;
};

class ConsoleNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = 'notification-console';

  private readonly logger_: Logger;
  private readonly prefix_: string;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();
    this.logger_ = logger;
    this.prefix_ = options.prefix ?? '🔔';
  }

  async send(notification: NotificationTypes.ProviderSendNotificationDTO): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    const line = '─'.repeat(60);
    const banner = [
      '',
      line,
      `${this.prefix_}  CONSOLE NOTIFICATION`,
      line,
      `to:       ${notification.to ?? '(none)'}`,
      `channel:  ${notification.channel}`,
      `template: ${notification.template}`,
      `data:     ${JSON.stringify(notification.data ?? {})}`,
      line,
      '',
    ].join('\n');

    this.logger_.info(banner);

    return {};
  }
}

export default ConsoleNotificationProviderService;
