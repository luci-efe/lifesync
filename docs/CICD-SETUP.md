# CI/CD Setup Guide for LifeSync

This guide details how to configure Azure DevOps to support the LifeSync CI/CD pipelines.

## Prerequisites

1.  **Azure Subscription**: Access to the Azure portal and the subscription where resources are deployed.
2.  **Azure DevOps Organization & Project**: Access to the Azure DevOps project.
3.  **Docker Hub Account**: A Docker Hub account to store container images.
4.  **Clerk Account**: Access to the Clerk dashboard for API keys.

## 1. Service Connections

Create the following service connections in Azure DevOps (Project Settings > Service connections):

### Docker Registry
*   **Service connection type**: Docker Registry
*   **Registry type**: Docker Hub
*   **Docker ID**: `dockerhub-lifesync`
*   **Docker Hub ID**: Your Docker Hub username
*   **Password/Token**: Your Docker Hub Access Token (Settings > Security)
*   **Service connection name**: `dockerhub-lifesync`
*   **Grant access permission to all pipelines**: Yes

### Azure Resource Manager (Dev)
*   **Service connection type**: Azure Resource Manager
*   **Authentication method**: Service principal (automatic)
*   **Scope level**: Subscription
*   **Subscription**: Select your subscription
*   **Resource Group**: `rg-lifesync-dev`
*   **Service connection name**: `azure-lifesync-dev`
*   **Grant access permission to all pipelines**: Yes

### Azure Resource Manager (Prod)
*   **Service connection type**: Azure Resource Manager
*   **Authentication method**: Service principal (automatic)
*   **Scope level**: Subscription
*   **Subscription**: Select your subscription
*   **Resource Group**: `rg-lifesync-prod`
*   **Service connection name**: `azure-lifesync-prod`
*   **Grant access permission to all pipelines**: Yes

## 2. Variable Groups

Create the following variable groups in Azure DevOps (Pipelines > Library):

### LifeSync-Secrets-Dev
*   **Allow access to all pipelines**: Yes
*   **Variables**:
    *   `APPLICATIONINSIGHTS_CONNECTION_STRING`: (Secret) From Terraform output for dev
    *   `CLERK_PUBLISHABLE_KEY`: From Clerk Dashboard (Dev instance)
    *   `CLERK_SECRET_KEY`: (Secret) From Clerk Dashboard (Dev instance)
    *   `DATABASE_URL`: (Secret) From Terraform output for dev
    *   `DOCKERHUB_TOKEN`: (Secret) Your Docker Hub Access Token
    *   `DOCKERHUB_USERNAME`: Your Docker Hub username
    *   `NEXT_PUBLIC_API_URL`: The URL of your dev backend (e.g., `https://lifesync-backend-dev.azurewebsites.net`)

### LifeSync-Secrets-Prod
*   **Allow access to all pipelines**: Yes
*   **Variables**:
    *   `APPLICATIONINSIGHTS_CONNECTION_STRING`: (Secret) From Terraform output for prod
    *   `CLERK_PUBLISHABLE_KEY`: From Clerk Dashboard (Prod instance)
    *   `CLERK_SECRET_KEY`: (Secret) From Clerk Dashboard (Prod instance)
    *   `DATABASE_URL`: (Secret) From Terraform output for prod
    *   `DOCKERHUB_TOKEN`: (Secret) Your Docker Hub Access Token
    *   `DOCKERHUB_USERNAME`: Your Docker Hub username
    *   `NEXT_PUBLIC_API_URL`: The URL of your prod backend (e.g., `https://lifesync-backend-prod.azurewebsites.net`)

## 3. Environments

Create the following environments in Azure DevOps (Pipelines > Environments):

### dev
*   **Description**: Development environment
*   **Approvals**: None

### prod
*   **Description**: Production environment
*   **Approvals and Checks**:
    *   Add "Approvals"
    *   Add yourself (or team members) as approvers
    *   Timeout: 3 days (or as desired)

## 4. Pipeline Setup

1.  Go to **Pipelines** > **New Pipeline**.
2.  Select **Azure Repos Git**.
3.  Select your repository.
4.  Select **Existing Azure Pipelines YAML file**.
5.  Select `/pipelines/backend-pipeline.yml`.
6.  Save (and run if ready).
7.  Repeat for `/pipelines/frontend-pipeline.yml`.

## Troubleshooting

*   **Service Connection Fails**: Ensure the Service Principal has Contributor access to the Resource Group.
*   **Docker Push Fails**: Verify the Docker Hub token has Read & Write permissions.
*   **Deployment Fails**: Check the App Service logs in Azure Portal. Ensure `DOCKER_ENABLE_CI` is set to `true` in App Service Configuration.
