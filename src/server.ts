import { database, dbConfig } from "./config";
import { logger } from "./utils";
import app from "./app";
// import { config } from "dotenv";

const port = process.env.PORT || 3000;
// config();
// Initialize database connection
const initializeDatabase = async () => {
  try {
    // await database.connect(dbConfig);
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

// Start server
export const startServer = async () => {
  await initializeDatabase();
  
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await database.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});