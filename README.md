# Job Portal App

![App Icon](https://github.com/user-attachments/assets/ccc14001-ef63-43f5-a0d9-64db22ca1957)

A mobile-first job portal application built with Expo and React Native.

## Overview

This application connects companies with potential employees. Companies can register to post and manage job listings, while job seekers can browse and view these opportunities without needing an account.

## App Demo Video

Watch a demonstration of the app's features and functionality on YouTube:

[Job Portal App Demo](https://youtu.be/shBtqXoKAxA)

## Download the App

You can download and install the latest build of the application here:

[Download App from Expo.dev](https://expo.dev/accounts/tharidi2002/projects/job-portal/builds/dfcd648d-1a92-4296-9867-1c4b68de56cc)

## Technologies Used

*   **Expo:** A framework and platform for universal React applications.
*   **React Native:** A library for building native mobile apps with JavaScript and React.
*   **Firebase:** Used for backend services, including authentication and database.
*   **NativeWind:** A utility-first styling library for React Native.
*   **Expo Router:** A file-based routing library for React Native and web apps.

## Key Features

### For Companies:

*   **Authentication:** Secure registration and login for company accounts.
*   **Profile Management:** Create and maintain a detailed company profile, including logo, name, location, and contact information.
*   **Job Management:** Post new job vacancies, and update or remove existing ones.
*   **Interactive Calendar:** View and manage job-related dates and deadlines.
*   **Company Directory:** View a list of all companies on the platform. You can temporarily hide companies from your view.

### For Job Seekers:

*   **Browse Jobs:** View all posted job vacancies from various companies.
*   **View Company Profiles:** Access details of the companies that have posted jobs.

## Screenshots

| Login | Registration |
| :---: | :---: |
| ![Login Page](https://github.com/user-attachments/assets/a7496b96-596d-445d-8e6c-4f1a721f6813) | ![Register PAge](https://github.com/user-attachments/assets/0d66d594-8c2e-4819-b8de-f0c1ea03db48) |

| Dashboard Navigation | Job Calendar |
| :---: | :---: |
| ![Dashboard Navigation](https://github.com/user-attachments/assets/ecb9a5ec-efc3-4d33-84f7-5c25275a4e52) | ![Job Calendar](https://github.com/user-attachments/assets/98b0c008-8c87-4c2c-abbf-a7ab253be69c) |

| My Job Postings | All Companies |
| :---: | :---: |
| ![My Job Postings](https://github.com/user-attachments/assets/c3f340d3-9353-480c-aceb-95e3f06d22fb) | ![All Companies](https://github.com/user-attachments/assets/d103fc30-14bc-403a-b765-a867b7185fa5) |

| Company Profile |
| :---: |
| ![Company Profile](https://github.com/user-attachments/assets/f4455e62-b424-47f1-ace3-eaa6aeadfae4) |

## Getting Started with Development

### Prerequisites

*   **Node.js:** >=18.0.0
*   **npm:** >=9.0.0
*   **Expo Go App:** Installed on your Android or iOS device.

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npx expo start
```

This will open the Expo developer tools in your terminal. You can then run the app on:

*   An Android emulator or physical device
*   An iOS simulator or physical device
*   In your web browser

## Building the App

To create a production-ready build of the app, you can use Expo Application Services (EAS).

### 1. Install the EAS CLI

```bash
npm install -g eas-cli
```

### 2. Configure your project

If you haven't already, configure your project with EAS:

```bash
eas init
```

### 3. Start a build

```bash
eas build
```

You can choose a specific platform and build profile. For example:

```bash
eas build --platform android --profile preview
```

For more information, see the [EAS Build documentation](https://docs.expo.dev/build/introduction/).

## Learn More

To learn more about developing your project with Expo, look at the following resources:

- [Expo Documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our guides.
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the Community

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord Community](https://chat.expo.dev): Chat with Expo users and ask questions.
