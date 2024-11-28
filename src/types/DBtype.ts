export interface DatabaseConfig {
    uri: string;
  }
  
  export interface MongooseOptions {
    autoIndex: boolean;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
  }