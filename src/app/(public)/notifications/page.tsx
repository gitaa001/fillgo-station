import BottomNavbar from "@/components/navbar";

import {
  criticalNotifications,
  notifications,
  type AppNotification,
} from "@/lib/notifications";

import {
  FaExclamationTriangle,
  FaRegClock,
} from "react-icons/fa";

const levelStyles: Record<
  AppNotification["level"],
  {
    border: string;
    icon: string;
    badge: string;
  }
> = {
  critical: {
    border: "border-red-500",
    icon: "text-red-500",
    badge: "bg-red-500",
  },
  warning: {
    border: "border-yellow-500",
    icon: "text-yellow-500",
    badge: "bg-yellow-500",
  },
  info: {
    border: "border-blue-500",
    icon: "text-blue-500",
    badge: "bg-blue-500",
  },
};

function NotificationCard({
  notification,
  showBadge = false,
}: {
  notification: AppNotification;
  showBadge?: boolean;
}) {
  const styles =
    levelStyles[notification.level];

  return (
    <div
      className={`
        rounded-xl
        border-2
        bg-white
        px-4
        py-4
        ${styles.border}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-5 text-slate-600">
          {notification.message}
        </p>

        {showBadge && (
          <span
            className={`
              shrink-0
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              text-white
              ${styles.badge}
            `}
          >
            Kritis
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        <FaRegClock />
        <span>{notification.timestampLabel}</span>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen justify-center bg-[#EFF6FF]">
      <div className="relative min-h-screen w-full max-w-sm overflow-hidden rounded-3xl bg-white outline outline-gray-300">
        <div className="h-screen overflow-y-auto px-4 pb-24 pt-10">
          <header className="mb-7">
            <h1 className="text-2xl font-bold text-slate-950">
              Notifikasi
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update terbaru sistem
            </p>
          </header>

          {criticalNotifications.length > 0 && (
            <section className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />

                <h2 className="text-lg font-bold text-red-500">
                  Kondisi Kritis
                </h2>
              </div>

              <div className="space-y-3">
                {criticalNotifications.map(
                  (notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      showBadge
                    />
                  )
                )}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-950">
              Semua Notifikasi
            </h2>

            <div className="space-y-3">
              {notifications.map(
                (notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                )
              )}
            </div>
          </section>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}
