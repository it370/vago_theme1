self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Notification", body: event.data.text() };
  }

  const { title, body, icon, badge, tag, data = {} } = payload;

  event.waitUntil(
    self.registration.showNotification(title ?? "Notification", {
      body,
      icon: icon ?? "/icon-192.png",
      badge: badge ?? "/badge-72.png",
      tag: tag ?? "general",
      renotify: true,
      data,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    }),
  );
});
