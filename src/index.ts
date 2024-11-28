import { startServer } from "./server";
import { database } from "./config";
import { logger } from "./utils";

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

startServer();
