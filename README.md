# Allocade - Allo V2 Interface Documentation

## For Users

### Introduction

Welcome to the Allo V2 interface on the Arbitrum network. This platform offers a comprehensive suite of features for interacting with the Allo V2 protocol, ensuring a seamless and intuitive user experience. Below is a detailed guide to the features and workflows that our interface provides.

### Features Overview

**Profile Management:** Utilize the registry.sol contract to create and manage your profile.

![image](https://github.com/renexy/arbitrum-showcase/assets/129852498/1758c95c-edf4-47d4-a29e-34faa4440ef2)

**Pool Creation and Management:** Create pools linked to your profile with ease, and oversee their operations.

![image](https://github.com/renexy/arbitrum-showcase/assets/129852498/872cd675-9cf5-49ef-aad8-1d64892f3335)

**Pool Manager & Allocator Interaction:** Through the Allo.sol contract, manage pool managers and allocators efficiently.

![image](https://github.com/renexy/arbitrum-showcase/assets/129852498/1cb519d7-8a90-45d8-8848-451d781685a2)

**Exploration:** Engage with the platform by browsing active and ended pools, and exploring other user profiles.

![image](https://github.com/renexy/arbitrum-showcase/assets/129852498/cde7e2d7-4b18-44cd-869d-1961c078e950)
![image](https://github.com/renexy/arbitrum-showcase/assets/129852498/cce64cd6-e6af-4063-bd28-c4caffe668ec)

**Advanced Options:** Implement secure ownership transfers for profiles.

![image](https://github.com/renexy/arbitrum-showcase/assets/129852498/3700b480-d09f-4b82-a42e-78adb1aa64a4)

**User-Centric Design:** Experience clear guidance at every step with our step-by-step interfaces.

**Enhanced Capabilities:** Utilize additional queries for listing Allocators for specific Microgrants strategies, giving pool managers more control.

**Google's MUI Integration:** Our interface leverages Google's Material-UI (MUI), known for its user-friendly and accessible design. MUI's intuitive layout and clear, familiar visual elements ensure that managing profiles, pools, managers, and allocators is a smooth and pleasant experience. This choice of UI/UX framework is particularly beneficial given the complexity and numerous components of our platform, making it easier for users to navigate and perform various tasks efficiently.

### User Workflows

#### Creating and Managing a Profile

**Profile Creation:** Start by creating your profile using the registry.sol contract.

**Pool Setup:** After your profile is active: Define your pool's purpose and parameters. Assign managers to oversee pool operations.

#### Pool Management

**Role of Pool Managers:** As a manager, you will: 

- Supervise pool operations.
- Set allocators who can cast votes on applications through the interface.

#### Exploring and Participating in Pools

**Browsing Pools:** Explore various pools based on criteria like name, owner, profile ID, or anchor address.

**Viewing Applications:** Access detailed views of each pool's applications.

#### Additional Features

**Allocator Access:** Allocators get a detailed view of pool information on a single page, including strategy type, fund amount, metadata, managers, allocators, and applicant details with voting functionality.

**Management Ease:** Pool managers and admins can easily manage allocators and pool managers respectively, with lists and management tools readily available on the pool page.

## For Developers

### Overview

This section is aimed at developers interested in understanding the technical structure of our Allo V2 interface project - Allocade.

### Key Components

**apolloClient.js:** Initializes Apollo Client for GraphQL API interactions.

**components/:** Contains React components such as createProfile, createPool, browsePools, browseProfiles, pool, and profile.

**global/functions.ts:** Hosts utility functions for global application use.

**hooks/:** Features React hooks like allo for Allo interactions, context for application context, profile for profile management, and registry for registry interactions.

**queries/:** Stores GraphQL queries for different application parts.

**services/:** Manages services for external API or database interactions.

**types/:** Includes TypeScript type definitions for the application.

**utils/:** Contains additional utility functions.

**wagmiConfig.ts:** Provides configuration settings for the application.

### Getting Started
Setup: Clone the repository and install dependencies - yarn || npm install.

Development: Run the development server with - yarn dev || npm run dev

Explore Components: Understand the role of each component and how they interact with the Allo protocol.

Understand Hooks and Queries: Familiarize yourself with our custom hooks and GraphQL queries.

Review Types and Utils: Go through our type definitions and utility functions for a comprehensive understanding.

For queries or support, please open an issue in the GitHub repository or contact our development team.

This documentation aims to provide clarity and efficiency for both users and developers engaging with the Allo V2 interface. We appreciate your interest and support in our project.
