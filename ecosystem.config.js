module.exports = {
  apps: [
    {
      name: "Coodo-Pay",
      script: "app.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
