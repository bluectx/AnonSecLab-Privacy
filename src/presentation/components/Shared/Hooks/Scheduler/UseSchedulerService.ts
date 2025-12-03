import { DefaultSchedulerService } from '@/application/Services/SchedulerService';

export function useSchedulerService() {
  const service = new DefaultSchedulerService();
  return {
    schedulerService: service,
  };
}
