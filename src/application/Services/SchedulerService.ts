export interface ScheduledTask {
  readonly id: string;
  readonly name: string;
  readonly interval: number; // milliseconds
  readonly lastRun?: Date;
  readonly nextRun: Date;
  readonly enabled: boolean;
}

export interface SchedulerService {
  scheduleTask(
    id: string,
    name: string,
    interval: number,
    callback: () => Promise<void>,
  ): void;
  cancelTask(id: string): void;
  getScheduledTasks(): readonly ScheduledTask[];
  start(): void;
  stop(): void;
}

export class DefaultSchedulerService implements SchedulerService {
  private readonly tasks = new Map<string, ScheduledTask>();

  private readonly callbacks = new Map<string, () => Promise<void>>();

  private readonly timers = new Map<string, NodeJS.Timeout>();

  private isRunning = false;

  public scheduleTask(
    id: string,
    name: string,
    interval: number,
    callback: () => Promise<void>,
  ): void {
    this.tasks.set(id, {
      id,
      name,
      interval,
      nextRun: new Date(Date.now() + interval),
      enabled: true,
    });
    this.callbacks.set(id, callback);

    if (this.isRunning) {
      this.startTask(id);
    }
  }

  public cancelTask(id: string): void {
    this.stopTask(id);
    this.tasks.delete(id);
    this.callbacks.delete(id);
  }

  public getScheduledTasks(): readonly ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    for (const taskId of this.tasks.keys()) {
      this.startTask(taskId);
    }
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    for (const taskId of this.timers.keys()) {
      this.stopTask(taskId);
    }
  }

  private startTask(id: string): void {
    const task = this.tasks.get(id);
    if (!task || !task.enabled) {
      return;
    }

    this.stopTask(id);

    const callback = this.callbacks.get(id);
    if (!callback) {
      return;
    }

    const delay = Math.max(0, task.nextRun.getTime() - Date.now());
    const timer = setTimeout(async () => {
      await this.executeTask(id, callback);
    }, delay);

    this.timers.set(id, timer);
  }

  private stopTask(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private async executeTask(
    id: string,
    callback: () => Promise<void>,
  ): Promise<void> {
    const task = this.tasks.get(id);
    if (!task) {
      return;
    }

    try {
      await callback();
      const updatedTask: ScheduledTask = {
        ...task,
        lastRun: new Date(),
        nextRun: new Date(Date.now() + task.interval),
      };
      this.tasks.set(id, updatedTask);

      if (this.isRunning && updatedTask.enabled) {
        this.startTask(id);
      }
    } catch (error) {
      console.error(`Error executing scheduled task ${id}:`, error);
    }
  }
}
