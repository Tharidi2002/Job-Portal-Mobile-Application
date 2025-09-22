# 💼 Job Portal - Company & Job Management App

![Meal Mate Logo](./assets/images/MealMate.png)

## 📱 Overview

**Job Portal** is a modern React Native mobile application built with Expo that helps companies manage job postings, company profiles, and applicants efficiently. The app features company registration, job CRUD, gallery management, and a professional UI for job seekers and companies.

---

## 🚀 Key Features

### 🔐 **Authentication System**

- **User Registration**: Create account with email and password
- **Secure Login**: Firebase Authentication integration
- **Profile Management**: Complete user profile with photo upload
- **Session Persistence**: Automatic login state management
- **Logout Functionality**: Secure session termination

### 💼 **Job Management**

- **Create Jobs**: Add job postings with title, description, location, and salary
- **Edit Jobs**: Update job details and images
- **Delete Jobs**: Remove jobs with confirmation dialogs
- **View Jobs**: Browse all jobs in organized layout
- **Real-time Sync**: Live updates across all devices

### 🏢 **Company Management**

- **Company Registration**: Register company with logo, name, location, CEO, and gallery
- **Profile Editing**: Update company profile and gallery
- **Job Management**: Manage all jobs posted by the company

### 👤 **Applicant Management**

- **View Applicants**: See all applicants for a job
- **Manage Applications**: Accept or reject applicants

### 📸 **Advanced Camera System**

- **Photo Capture**: High-quality meal photography
- **Front/Back Camera**: Toggle between camera modes
- **Gallery Integration**: Select existing photos from device
- **Auto-save to Gallery**: Photos automatically saved to device
- **Direct Integration**: Camera photos flow into meal creation
- **Permission Management**: Proper camera and media permissions

### 📱 **QR Code Scanner**

- **Real-time Scanning**: Instant QR code detection
- **Visual Feedback**: Scanning frame with corner indicators
- **URL Detection**: Automatic web URL identification and opening
- **Error Handling**: Graceful handling of invalid QR codes
- **Mode Switching**: Toggle between camera and scanner modes

### 🔔 **Smart Notification System**

- **Scheduled Meal Reminders**: Automatic notifications for planned meals
- **Custom Notification Times**: Set personalized reminder times for each meal type
- **Meal Type Controls**: Individual settings for breakfast, lunch, dinner, and snack notifications
- **Meal Planning Reminders**: Daily reminders to plan meals in advance
- **Permission Management**: Proper notification permission handling for Android/iOS
- **Test Notifications**: Built-in functionality to test notification delivery
- **Persistent Settings**: Notification preferences saved using AsyncStorage
- **Real-time Scheduling**: Automatic notification scheduling when meals are planned
- **Smart Cleanup**: Automatic removal of notifications when meals are deleted or rescheduled

### 🎨 **Theme System**

- **Dark/Light Mode**: Complete theme switching
- **System Integration**: Follow device theme preferences
- **Persistent Settings**: Theme choice saved using AsyncStorage
- **Comprehensive Colors**: Full color palette for all UI elements
- **Real-time Switching**: Instant theme changes without app restart

### 👤 **User Profile Management**

- **Profile Creation**: Complete user profile setup during registration
- **Profile Editing**: Update display name, email, profile image
- **Image Upload**: Profile photo management with Cloudinary
- **Account Settings**: Comprehensive user account management
- **Data Persistence**: Profile data stored in Firestore

### 🏠 **Dashboard & Navigation**

- **Home Screen**: Quick overview with recent meals and statistics
- **Bottom Tab Navigation**: Easy access to all major sections
- **Quick Actions**: Fast access to common tasks
- **Statistics Display**: Meal counts, planning overview
- **Recent Activity**: Latest meals and planning activities

---

### **Screenshots**

#### Home Screen

<p align="center">
  <img src="./screenshots/home screen 1 st image.jpg" width="300" alt="Home Screen 1">
  <img src="./screenshots/home screnn 2 nd image.jpg" width="300" alt="Home Screen 2">
</p>
<p align="center">
  <img src="./screenshots/home screen 3 rd image.jpg" width="300" alt="Home Screen 3">
  <img src="./screenshots/home screen 4th image.jpg" width="300" alt="Home Screen 4">
</p>
<p align="center">
  <img src="./screenshots/home screen 6 th image.jpg" width="300" alt="Home Screen 6">
</p>
</details>

<details>
<summary><b>� Companies & Jobs</b> (Click to expand)</summary>

#### Company Profile

<p align="center">
  <img src="./screenshots/edit profile 1 st image.jpg" width="300" alt="Company Profile 1">
  <img src="./screenshots/edit profile 2 nd image.jpg" width="300" alt="Company Profile 2">
</p>

#### Job Management

<p align="center">
  <img src="./screenshots/qr generator page 1 st image.jpg" width="300" alt="Job Management 1">
  <img src="./screenshots/qr genarator page 2 nd image.jpg" width="300" alt="Job Management 2">
</p>
<p align="center">
  <img src="./screenshots/qr generator page 3 rd image.jpg" width="300" alt="Job Management 3">
</p>
</details>

### **Youtube Demo Link**

https://youtu.be/GHPtuMilwSc?si=twRUEDScC8Nflg7l

### **APK Expo-Link**

https://expo.dev/artifacts/eas/pahaYAgghbYADxDwmcUduL.apk

### **Deployment URL**

https://meal-mate--x6g2g1f659.expo.app

## 🛠️ Technical Implementation

### **Frontend Architecture**

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript for type safety
- **Navigation**: Expo Router with file-based routing
- **Styling**: NativeWind (Tailwind CSS) + inline styles
- **Icons**: Material Icons from @expo/vector-icons
- **State Management**: React Context API with hooks

### **Backend & Database**

- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **Real-time Updates**: Firestore onSnapshot listeners
- **Image Storage**: Cloudinary cloud storage
- **Data Structure**: Optimized collections with proper indexing

### **Key Technologies**

```json
{
  "expo": "~54.0.7",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "expo-camera": "^17.0.7",
  "expo-notifications": "~0.32.11",
  "firebase": "^12.2.1",
  "typescript": "~5.8.3",
  "@expo/vector-icons": "^15.0.2"
}
```

### **Camera & Media**

- **Camera API**: expo-camera with CameraView
- **Image Picker**: expo-image-picker for gallery access
- **Media Library**: expo-media-library for photo saving
- **Barcode Scanning**: expo-barcode-scanner for QR codes
- **Permissions**: Proper runtime permission handling

### **Notifications**

- **Expo Notifications**: expo-notifications for cross-platform push notifications
- **Permission Handling**: Automatic notification permission requests
- **Scheduling System**: Date-based notification scheduling with proper trigger types
- **Settings Persistence**: AsyncStorage for notification preferences
- **Channel Management**: Android notification channels for categorized notifications

---

## 📁 Project Structure

...
│ ├── LoaderContext.tsx # Loading state
│ └── ThemeContext.tsx # Theme management
├── 📁 services/ # API & business logic
│ ├── authService.ts # Authentication services
│ ├── jobService.ts # Job CRUD operations
│ ├── notificationService.ts # Notification scheduling & management
│ └── userService.ts # Company profile services
├── 📁 types/ # TypeScript definitions
│ ├── job.ts # Job data types
│ └── user.ts # Company data types
└── 📁 assets/ # Static resources
├── 📁 images/ # App images & icons
└── 📁 fonts/ # Custom fonts

---

## 🔧 Core Functions & APIs

### **Authentication Services**

```typescript
// User authentication and session management
export const login = (email: string, password: string)
export const logout = ()
export const createUserWithEmailAndPassword()
export const signInWithEmailAndPassword()
```

### **Job Services**

```typescript
// Complete job management system
export const createJob = async (job: Job)
export const getJobs = async (companyId: string)
export const getJobById = async (id: string)
export const updateJob = async (id: string, job: Partial<Job>)
export const deleteJob = async (id: string)
export const getApplicants = async (jobId: string)
export const applyToJob = async (jobId: string, applicant: Applicant)
export const scheduleNotificationForJob = async (job: Job)
```

### **Notification Services**

```typescript
// Comprehensive notification management system
export const requestNotificationPermissions = async ()
export const scheduleMealNotification = async (meal: Meal, reminderTime: Date)
export const cancelMealNotification = async (mealId: string)
export const getNotificationSettings = async ()
export const updateNotificationSettings = async (settings: NotificationSettings)
export const sendTestNotification = async (mealType: string, reminderTime: Date)
export const initializeNotifications = async ()
export const getAllScheduledNotifications = async ()
export const clearAllNotifications = async ()
export const scheduleMealPlanningReminders = async ()
export const cancelMealPlanningReminders = async ()
export const sendTestMealPlanningReminder = async (mealType: string)
```

### **User Profile Services**

```typescript
// User profile and data management
export const createUserProfile = async (userProfile: UserProfile)
export const getUserProfile = async (userId: string)
export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>)
export const createOrUpdateUserProfile = async (userProfile: UserProfile)
```

### **Image & Media Services**

```typescript
// Image upload and management
export const uploadImageToCloudinary = async (imageUri: string)
export const pickImage = async ()
export const takePicture = async ()
export const saveToLibrary = async (uri: string)
```

---

## 📱 Screen Functionality

### **🏠 Home Dashboard**

- **Welcome Message**: Personalized greeting with user profile
- **Quick Actions**: Fast access to common tasks (Add Meal, Plan Meals, Camera, Favorites)
- **Today's Meals**: Overview of meals planned for current day
- **Recent Meals**: Latest created meals with quick actions
- **Statistics**: Meal counts and planning overview
- **Theme Toggle**: Dark/light mode switcher

### **🍽️ Meals Management**

- **Meals List**: Grid/list view of all user meals
- **Add New Meal**: Floating action button for quick meal creation
- **Real-time Updates**: Live meal list updates using Firestore listeners
- **Favorite Toggle**: One-tap favorite management
- **Delete Confirmation**: Safe meal deletion with confirmation

### **📝 Meal Creation/Editing Form**

- **Rich Form Fields**: Title, name, description, ingredients
- **Nutritional Information**: Calories, servings, cooking time
- **Meal Type Selection**: Breakfast, lunch, dinner, snack buttons
- **Image Management**: Gallery picker + camera integration
- **Schedule Meal**: Option to directly schedule meal during creation
- **Notification Reminders**: Set custom reminder times for individual meals
- **Form Validation**: Required field validation and error handling

### **🔔 Notification Settings**

- **Meal Type Controls**: Individual notification toggles for each meal type
- **Custom Reminder Times**: Personalized notification scheduling for breakfast, lunch, dinner, and snacks
- **Test Notifications**: Built-in test functionality to verify notification delivery
- **Permission Management**: Automatic handling of notification permissions
- **Real-time Updates**: Instant settings synchronization across the app
- **Persistent Storage**: Settings automatically saved and restored

### **📅 Meal Planning Calendar**

- **Weekly View**: Interactive 7-day calendar
- **Date Navigation**: Scroll through different weeks
- **Meal Type Sections**: Organized breakfast, lunch, dinner, snack sections
- **Drag & Drop Interface**: Select meals from library to plan
- **Visual Indicators**: Show planned vs. empty meal slots
- **Confirmation Dialogs**: Verify meal planning actions

### **❤️ Favorites Screen**

- **Real-time Favorites**: Live updates using onSnapshot listeners
- **Filter Options**: Show only favorite meals
- **Quick Actions**: Unfavorite, plan, or edit favorite meals
- **Empty State**: Helpful message when no favorites exist

### **📸 Camera Interface**

- **Professional UI**: Native camera controls with intuitive design
- **Mode Switching**: Camera/QR scanner toggle
- **Camera Controls**: Capture, flip, gallery access
- **QR Scanner**: Real-time QR code detection with visual frame
- **Permission Handling**: Proper camera and media library permissions
- **Error Management**: Graceful error handling and user feedback

### **👤 Profile Management**

- **Profile Display**: User information with profile photo
- **Edit Profile**: Update name, email, profile image
- **Image Upload**: Profile photo management via camera/gallery
- **Account Settings**: Theme preferences and app settings
- **Logout**: Secure session termination

---

## 🎯 Data Models

### **Meal Model**

```typescript
interface Meal {
  id?: string;
  title: string;
  name: string;
  description?: string;
  image?: string;
  userId: string;
  favorite: boolean;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  plannedDate?: string;
  ingredients?: string[];
  cookingTime?: number;
  servings?: number;
  calories?: number;
  isPlanned?: boolean;
  reminderTime?: string;
  notificationId?: string;
}
```

### **Notification Settings Model**

```typescript
interface NotificationSettings {
  enabled: boolean;
  jobReminders: boolean;
  notificationTime: string;
}
```

### **Company Profile Model**

```typescript
interface CompanyProfile {
  id?: string;
  userId: string;
  companyName: string;
  email: string;
  logo?: string;
  location?: string;
  ceoName?: string;
  gallery?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
  };
}
```

---

## 🔐 Security & Permissions

### **Firebase Security Rules**

- User-based data isolation
- Authenticated read/write operations
- Field-level validation
- Rate limiting protection

### **App Permissions**

- **Camera**: Required for photo capture and QR scanning
- **Media Library**: Needed for photo saving and gallery access
- **Notifications**: Required for meal reminder notifications
- **Internet**: Required for Firebase and Cloudinary operations
- **Storage**: Local storage for theme preferences and notification settings

---

## 📋 Installation & Setup

### **Prerequisites**

```bash
Node.js >= 18.0.0
npm or yarn
Expo CLI
iOS Simulator / Android Emulator (optional)
```

### **Installation Steps**

```bash
# Clone repository
git clone https://github.com/YourUsername/meal-mate.git

# Navigate to project directory
cd meal-mate

# Install dependencies
npm install

# Start development server
npx expo start
```

### **Environment Configuration**

Create a `firebase.ts` file with your Firebase configuration:

```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## 🚀 Performance Optimizations

### **Data Management**

- **Real-time Updates**: Firestore onSnapshot for live data
- **Optimistic Updates**: Immediate UI feedback
- **Image Optimization**: Cloudinary automatic optimization
- **Caching**: AsyncStorage for offline theme preferences
- **Lazy Loading**: Efficient component rendering

### **Memory Management**

- **Image Compression**: 0.8 quality for performance balance
- **Component Cleanup**: Proper useEffect cleanup
- **Memory Leaks Prevention**: Unsubscribe from listeners
- **Efficient Queries**: Optimized Firestore queries

---

## 🔄 Development Workflow

### **Development Commands**

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
```

---

## 📱 Platform Support

### **Supported Platforms**

- ✅ **iOS**: iPhone and iPad support
- ✅ **Android**: Phone and tablet support
- ✅ **Web**: Progressive Web App capabilities
- 📱 **Expo Go**: Development testing on physical devices

### **Device Requirements**

- **iOS**: iOS 13.0 or later
- **Android**: Android 6.0 (API level 23) or later
- **Camera**: Required for photo capture and QR scanning
- **Internet**: Required for Firebase synchronization

---

## 🏆 Key Achievements

✅ **Complete Meal Management System**  
✅ **Smart Notification & Reminder System**  
✅ **Advanced Camera & QR Code Integration**  
✅ **Real-time Synchronization**  
✅ **Modern UI with Theme Support**  
✅ **Comprehensive User Authentication**  
✅ **Cloud-based Image Storage**  
✅ **Cross-platform Compatibility**  
✅ **Type-safe Development**

---

**Made with ❤️ using React Native, Expo, and Firebase**
