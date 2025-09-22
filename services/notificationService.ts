import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Define job notification types as needed

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Check if device supports notifications
      if (!Device.isDevice) {
        console.log("Notifications only work on physical devices");
        return false;
      }

      // Request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Notification permissions not granted");
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("meal-reminders", {
          name: "Meal Reminders",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
          description: "Notifications for scheduled meal reminders",
        });
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Error initializing notifications:", error);
      return false;
    }
  }

  // Stub for scheduling job-related notifications
  async scheduleJobNotification(job: { id: string; title: string; companyId: string; }): Promise<string | null> {
    // Implement job notification logic here
    return null;
  }

  // Stub for canceling job notifications
  async cancelJobNotification(jobId: string): Promise<void> {
    // Implement job notification cancel logic here
  }

  // Stub for updating job notifications
  async updateJobNotification(job: { id: string; title: string; companyId: string; }): Promise<string | null> {
    // Implement job notification update logic here
    return null;
  }

  // Stub for scheduling daily job reminders
  async scheduleDailyJobReminders(jobs: Array<{ id: string; title: string; companyId: string; }>): Promise<void> {
    // Implement job daily reminder logic here
  }

  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Stub for canceling all job notifications
  async cancelAllJobNotifications(): Promise<void> {
    // Implement cancel all job notifications logic here
  }

  // Notification response handling
  // Stub for notification response listener for jobs
  setupNotificationResponseListener(): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener((response) => {
      // Handle navigation based on job notification data
      console.log("Job notification tapped:", response.notification.request.content.data);
      // Implement navigation logic for job detail screen if needed
    });
  }

  // Remove meal notification storage and helpers

  // Stub for scheduling job-related reminders
  async scheduleJobReminders(): Promise<void> {
    // Implement job reminder scheduling here
  }
}

export default NotificationService.getInstance();
