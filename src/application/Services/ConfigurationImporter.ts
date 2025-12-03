import type { CategoryCollection } from '@/domain/Collection/CategoryCollection';
import { UserSelectedScript } from '@/application/Context/State/Selection/Script/UserSelectedScript';
import type { SelectedScript } from '@/application/Context/State/Selection/Script/SelectedScript';
import type { ExportedConfiguration } from './ConfigurationExporter';

export interface ImportResult {
  readonly success: boolean;
  readonly selectedScripts: readonly SelectedScript[];
  readonly errors: readonly string[];
}

export class ConfigurationImporter {
  public import(
    config: ExportedConfiguration,
    collection: CategoryCollection,
  ): ImportResult {
    const errors: string[] = [];
    const selectedScripts: SelectedScript[] = [];

    if (config.os !== collection.os) {
      errors.push(`OS mismatch: configuration is for ${config.os}, but current OS is ${collection.os}`);
    }

    for (const exportedScript of config.scripts) {
      try {
        const script = collection.getScript(exportedScript.id);
        if (exportedScript.revert && !script.canRevert()) {
          errors.push(`Script ${exportedScript.id} cannot be reverted`);
        } else {
          selectedScripts.push(new UserSelectedScript(script, exportedScript.revert));
        }
      } catch (error) {
        errors.push(`Script ${exportedScript.id} not found: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return {
      success: errors.length === 0,
      selectedScripts,
      errors,
    };
  }

  public importFromJson(
    json: string,
    collection: CategoryCollection,
  ): ImportResult {
    try {
      const config = JSON.parse(json) as ExportedConfiguration;
      return this.import(config, collection);
    } catch (error) {
      return {
        success: false,
        selectedScripts: [],
        errors: [`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`],
      };
    }
  }
}
