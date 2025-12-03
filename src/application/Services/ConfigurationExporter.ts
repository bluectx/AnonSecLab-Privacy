import type { SelectedScript } from '@/application/Context/State/Selection/Script/SelectedScript';
import { OperatingSystem } from '@/domain/OperatingSystem';
import type { IEnvironmentVariables } from '@/infrastructure/EnvironmentVariables/IEnvironmentVariables';

export interface ExportedConfiguration {
  readonly version: string;
  readonly os: OperatingSystem;
  readonly scripts: readonly ExportedScript[];
  readonly timestamp: string;
}

export interface ExportedScript {
  readonly id: string;
  readonly revert: boolean;
}

export class ConfigurationExporter {
  constructor(
    private readonly environment: IEnvironmentVariables,
  ) {}

  public export(
    selectedScripts: readonly SelectedScript[],
    os: OperatingSystem,
  ): ExportedConfiguration {
    return {
      version: this.environment.version,
      os,
      scripts: selectedScripts.map((script) => ({
        id: script.script.executableId,
        revert: script.revert,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  public exportToJson(
    selectedScripts: readonly SelectedScript[],
    os: OperatingSystem,
  ): string {
    const config = this.export(selectedScripts, os);
    return JSON.stringify(config, null, 2);
  }
}
