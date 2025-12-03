import type { RuntimeEnvironment } from '@/infrastructure/RuntimeEnvironment/RuntimeEnvironment';

export enum NotificationType {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Success = 'success',
}

export interface NotificationOptions {
  readonly title: string;
  readonly body: string;
  readonly type?: NotificationType;
  readonly silent?: boolean;
  readonly actions?: readonly NotificationAction[];
}

export interface NotificationAction {
  readonly action: string;
  readonly title: string;
}

export interface INotificationService {
  show(options: NotificationOptions): Promise<void>;
  requestPermission(): Promise<NotificationPermission>;
}

export class NotificationService implements INotificationService {
  constructor(
    private readonly environment: RuntimeEnvironment,
  ) {}

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.environment.isRunningAsDesktopApplication) {
      if ('Notification' in window) {
        return Notification.requestPermission();
      }
      return 'denied';
    }
    return 'granted';
  }

  public async show(options: NotificationOptions): Promise<void> {
    if (this.environment.isRunningAsDesktopApplication) {
      await this.showElectronNotification(options);
    } else {
      await this.showBrowserNotification(options);
    }
  }

  private async showElectronNotification(
    options: NotificationOptions,
  ): Promise<void> {
    const { Notification } = await import('electron/main');
    const notification = new Notification({
      title: options.title,
      body: options.body,
      silent: options.silent ?? false,
    });
    notification.show();
  }

  private async showBrowserNotification(
    options: NotificationOptions,
  ): Promise<void> {
    if (!('Notification' in window)) {
      return;
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      return;
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: this.getIconForType(options.type),
      badge: this.getIconForType(options.type),
      silent: options.silent ?? false,
    });

    if (options.actions && 'actions' in Notification.prototype) {
      (notification as Notification & { actions: NotificationAction[] }).actions = [
        ...options.actions,
      ];
    }
  }

  private getIconForType(type?: NotificationType): string {
    switch (type) {
      case NotificationType.Error:
        return '/assets/icons/triangle-exclamation.svg';
      case NotificationType.Warning:
        return '/assets/icons/lightbulb.svg';
      case NotificationType.Success:
        return '/assets/icons/square-check.svg';
      default:
        return '/assets/icons/circle-info.svg';
    }
  }
}
