import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { createLogger } from './LoggingService.js';

const logger = createLogger('Config');

export interface TableConfig {
  tableName: string;
  desiredRows: {
    rowName: string;
    displayName: string;
  }[];
}

export interface UIConfig {
  viewDisplayName: string;
  featuresTable: string;
}

export interface AppConfig {
  username: string;
  role: string;
  tableConfigs: TableConfig[];
  uiConfig: UIConfig[];
}

export class ConfigService {
  private configPath: string;
  private config: AppConfig | null = null;
  
  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'config.json');
  }
  
  /**
   * Load config from file or create default if not found
   */
  loadConfig(): AppConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(configData);
        logger.info('Configuration loaded successfully');
      } else {
        this.config = this.createDefaultConfig();
        this.saveConfig();
        logger.info('Default configuration created');
      }
      
      return this.config!;
    } catch (error) {
      logger.error('Failed to load configuration', { error });
      this.config = this.createDefaultConfig();
      return this.config;
    }  }
  
  /**
   * Get table configurations
   */
  getTableConfigs(): TableConfig[] {
    if (!this.config) {
      this.loadConfig();
    }
    return this.config?.["tableConfigs"] || [];
  }
  
  /**
   * Get UI configurations
   */
  getUIConfigs(): UIConfig[] {
    if (!this.config) {
      this.loadConfig();
    }
    return this.config?.["uiConfig"] || [];
  }
  
  /**
   * Get user information
   */
  getUserInfo(): { username: string; role: string } {
    if (!this.config) {
      this.loadConfig();
    }
    return {
      username: this.config?.username || 'Default User',
      role: this.config?.role || 'USER'
    };
  }
  
  /**
   * Save config to file
   */
  private saveConfig(): void {
    if (!this.config) return;
    
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      logger.info('Configuration saved successfully');
    } catch (error) {
      logger.error('Failed to save configuration', { error });
    }
  }
  
  /**
   * Create default configuration
   */  private createDefaultConfig(): AppConfig {
    return {
      username: "Emmanuel Corneillet",
      role: "REX",
      tableConfigs: [
        {
          tableName: "ARTICLESDIMUDF",
          desiredRows: [
            { rowName: "ARTICLESCODE", displayName: "Code Item" },
            { rowName: "ARTICLESDESC", displayName: "Désignation Bricomax" },
            { rowName: "DIM7DESC", displayName: "Marque" },
            { rowName: "SUPPLIERCODE", displayName: "Référence Fournisseur" },
            { rowName: "BARCODE", displayName: "Code Barre" },
            { rowName: "ARTICLESUOM", displayName: "Unité d'achat" },
            { rowName: "LASTPURCHASEPRICE", displayName: "Dernier prix receptionné" },
            { rowName: "DEVISECODE", displayName: "Devise Prix d'Achat" },
            { rowName: "DIM6DESC", displayName: "Fournisseur" },
            { rowName: "DIM1CODE", displayName: "Rayon" },
            { rowName: "DIM1DESC", displayName: "Desc. Rayon" },
            { rowName: "DIM3CODE", displayName: "Famille" },
            { rowName: "DIM3DESC", displayName: "Desc. Famille" },
            { rowName: "DIM11DESC", displayName: "Commentaire" },
            { rowName: "DIM12DESC", displayName: "Statut" },
            { rowName: "DIM16DESC", displayName: "Opération" },
            { rowName: "DIM10DESC", displayName: "Permis" }
          ]
        },
        {
          tableName: "ZZTEMPOLAPSTOCK",
          desiredRows: [
            { rowName: "QTYONHAND", displayName: "Quantité à disposition" },
            { rowName: "QTYONORDER", displayName: "Quantité en commande" }
          ]
        }
      ],
      uiConfig: [
        { viewDisplayName: "Analyse", featuresTable: "ARTICLESDIMUDF" },
        { viewDisplayName: "Min/Max", featuresTable: "ZZTEMPOLAPSTOCK" },
        { viewDisplayName: "Modifications", featuresTable: "" }
      ]
    };
  }
}
