import type { components } from "@/types/generated/arroweye-api";

export type ApiNotification = components["schemas"]["Notification"];
export type NotificationAction = components["schemas"]["Action"];
export type NotificationType = NonNullable<ApiNotification["type"]>;

export type NotificationByType<T extends NotificationType> = Omit<
  ApiNotification,
  "type"
> & {
  type: T;
};

export type NotificationGroupKey =
  | "campaigns"
  | "milestones"
  | "security"
  | "assets"
  | "payments"
  | "others";

export type NotificationGroups = {
  campaigns: NotificationByType<"Campaigns">[];
  milestones: NotificationByType<"Milestones">[];
  security: NotificationByType<"Security">[];
  assets: NotificationByType<"Assets">[];
  payments: NotificationByType<"Payments">[];
  others: NotificationByType<"Others">[];
};

const notificationTypeAliases: Record<string, NotificationType> = {
  campaign: "Campaigns",
  campaigns: "Campaigns",
  milestone: "Milestones",
  milestones: "Milestones",
  security: "Security",
  drop: "Assets",
  drops: "Assets",
  asset: "Assets",
  assets: "Assets",
  payment: "Payments",
  payments: "Payments",
  other: "Others",
  others: "Others",
};

export const normalizeNotificationType = (type: unknown): NotificationType => {
  const normalized = String(type ?? "")
    .trim()
    .toLowerCase();
  return notificationTypeAliases[normalized] ?? "Others";
};

export const isApiNotification = (value: unknown): value is ApiNotification => {
  if (!value || typeof value !== "object") return false;

  const notification = value as Partial<ApiNotification>;
  return (
    typeof notification.id === "number" &&
    typeof notification.icon === "string" &&
    Array.isArray(notification.actions)
  );
};

export const groupNotifications = (
  notifications: readonly ApiNotification[],
): NotificationGroups => {
  const groups: NotificationGroups = {
    campaigns: [],
    milestones: [],
    security: [],
    assets: [],
    payments: [],
    others: [],
  };

  for (const notification of notifications) {
    const type = normalizeNotificationType(notification.type);

    switch (type) {
      case "Campaigns":
        groups.campaigns.push({ ...notification, type });
        break;
      case "Milestones":
        groups.milestones.push({ ...notification, type });
        break;
      case "Security":
        groups.security.push({ ...notification, type });
        break;
      case "Assets":
        groups.assets.push({ ...notification, type });
        break;
      case "Payments":
        groups.payments.push({ ...notification, type });
        break;
      case "Others":
        groups.others.push({ ...notification, type });
        break;
    }
  }

  return groups;
};

export interface MarkNotificationsReadInput {
  notification_ids: number[];
}
