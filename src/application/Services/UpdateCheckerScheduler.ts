import type { SchedulerService } from './SchedulerService';

export class UpdateCheckerScheduler {
  constructor(
    private readonly scheduler: SchedulerService,
    private readonly checkForUpdates: () => Promise<void>,
  ) {}

  public scheduleUpdateCheck(intervalHours: number = 24): void {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    this.scheduler.scheduleTask(
      'update-check',
      'Check for updates',
      intervalMs,
      this.checkForUpdates,
    );
  }
}
