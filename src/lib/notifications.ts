export type NotificationLevel =
  | "critical"
  | "warning"
  | "info";

export type AppNotification = {
  id: string;
  title?: string;
  message: string;
  level: NotificationLevel;
  isCritical?: boolean;
  timestampLabel: string;
};

export const notifications: AppNotification[] = [
  {
    id: "gedung-b-empty",
    message:
      "Dispenser Gedung B - Lt. 1 is empty. Immediate refill required.",
    level: "critical",
    isCritical: true,
    timestampLabel: "Baru saja",
  },
  {
    id: "gedung-a-low",
    message:
      "Dispenser Gedung A - Lt. 2 is almost empty (25% remaining).",
    level: "warning",
    timestampLabel: "5 menit lalu",
  },
  {
    id: "gedung-c-low",
    message:
      "Dispenser Gedung C - Lt. 3 is almost empty (18% remaining).",
    level: "warning",
    timestampLabel: "12 menit lalu",
  },
  {
    id: "gedung-b-turbidity",
    message:
      "High turbidity detected in Dispenser Gedung B - Lt. 1 (1.2 NTU).",
    level: "warning",
    timestampLabel: "20 menit lalu",
  },
  {
    id: "gedung-c-maintenance",
    message:
      "Dispenser Gedung C - Lt. 1 maintenance scheduled for tomorrow.",
    level: "info",
    timestampLabel: "1 jam lalu",
  },
];

export const criticalNotifications =
  notifications.filter(
    (notification) =>
      notification.isCritical
  );

export const hasNotifications =
  notifications.length > 0;
