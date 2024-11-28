import mongoose from 'mongoose';
import { DatabaseConfig } from 'types';
import { logger } from '../utils/logger';
import { config } from 'dotenv';

// Load environment variables
config();

export class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(config: DatabaseConfig): Promise<void> {
    if (this.isConnected) {
      logger.info('Database is already connected');
      return;
    }

    try {
      const options = {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      await mongoose.connect(config.uri, options);
      
      this.isConnected = true;
      logger.info('Successfully connected to database');

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        this.isConnected = false;
        logger.warn('MongoDB disconnected');
      });

    } catch (error) {
      this.isConnected = false;
      logger.error('Error connecting to database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Successfully disconnected from database');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}

export const database = Database.getInstance();

// Database connection configuration
export const dbConfig = {
  uri: process.env.MONGODB_URI || "mongodb+srv://"
};