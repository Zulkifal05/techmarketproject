export const developmentCategories = [
  "web-development",
  "frontend-development",
  "backend-development",
  "full-stack-development",
  "static-website-development",
  "custom-web-applications",

  "react-development",
  "nextjs-development",
  "angular-development",
  "vuejs-development",
  "svelte-development",

  "nodejs-development",
  "expressjs-development",
  "nestjs-development",
  "django-development",
  "flask-development",

  "spring-boot-development",
  "java-development",
  "php-development",
  "laravel-development",
  "ruby-on-rails-development",

  "mobile-app-development",
  "android-development",
  "ios-development",
  "flutter-development",
  "react-native-development",

  "wordpress-development",
  "shopify-development",
  "webflow-development",
  "wix-development",
  "squarespace-development",

  "ecommerce-development",
  "woocommerce-development",
  "magento-development",
  "bigcommerce-development",

  "rest-api-development",
  "graphql-development",
  "api-integration",
  "payment-gateway-integration",

  "mongodb-development",
  "postgresql-development",
  "mysql-development",
  "database-architecture",

  "docker-setup",
  "kubernetes-setup",
  "ci-cd-pipeline-setup",
  "cloud-deployment",

  "aws-development",
  "google-cloud-development",
  "azure-development",
  "serverless-development"
] as const;

export type DevelopmentCategory = typeof developmentCategories[number];