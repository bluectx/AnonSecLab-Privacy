import { NotificationService } from '@/application/Services/NotificationService';
import { CurrentEnvironment } from '@/infrastructure/RuntimeEnvironment/RuntimeEnvironmentFactory';

export function useNotificationService() {
  const service = new NotificationService(CurrentEnvironment);
  return {
    notificationService: service,
  };
}
