// PM2 ecosystem configuration file
// This file tells PM2 how to run and manage your Node.js app

module.exports = {
  // "apps" is an array because PM2 can manage multiple apps
  apps: [
    {
      // Name of the application in PM2
      // You will see this name in `pm2 list`, `pm2 logs`, etc.
      name: "node-crud-api",

      // Entry point of your Node.js application
      // PM2 will run: node src/server.js
      script: "index.js",

      // Number of instances to run
      // "max" means: one process per CPU core
      // Example: 4-core CPU → 4 Node.js processes
      instances: "max",

      // Execution mode
      // "cluster" enables Node.js cluster mode
      // Allows load balancing between multiple instances
      // Improves performance and fault tolerance
      exec_mode: "cluster",

      // Environment variables passed to the app
      env: {
        // Sets NODE_ENV to production
        // Used by frameworks/libraries to enable production optimizations
        NODE_ENV: "production"
      }
    }
  ]
};

