```js id="lc9gvr"
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8080";

const TOKEN_KEY = "ns_admin_token";
const EMAIL_KEY = "ns_admin_email";
const EXPIRY_KEY = "ns_admin_token_expiry";

// Singleton refresh state
let refreshPromise = null;

export const auth = {

  async login(email, password) {

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPassword =
      password.trim();

    const res = await fetch(
      `${API_BASE}/api/admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      }
    );

    if (!res.ok) {

      const err =
        await res.json().catch(() => ({}));

      throw new Error(
        err.error ||
        err.message ||
        "Invalid credentials"
      );
    }

    const data = await res.json();

    if (data.token) {
      localStorage.setItem(
        TOKEN_KEY,
        data.token
      );
    }

    localStorage.setItem(
      EMAIL_KEY,
      cleanEmail
    );

    if (data.expiresAt) {
      localStorage.setItem(
        EXPIRY_KEY,
        data.expiresAt
      );
    }

    return data;
  },

  async logout() {

    const token = this.getToken();

    if (token) {

      fetch(`${API_BASE}/api/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },

  async refreshSession() {

    // Prevent parallel refresh calls
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {

      const token = this.getToken();

      if (!token) {
        throw new Error("No token available");
      }

      const res = await fetch(
        `${API_BASE}/api/admin/refresh`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {

        this.logout();

        throw new Error(
          "Session refresh failed"
        );
      }

      const data = await res.json();

      if (data.token) {

        localStorage.setItem(
          TOKEN_KEY,
          data.token
        );
      }

      if (data.expiresAt) {

        localStorage.setItem(
          EXPIRY_KEY,
          data.expiresAt
        );
      }

      return data;

    })();

    try {

      return await refreshPromise;

    } finally {

      // Clear singleton lock
      refreshPromise = null;
    }
  },

  async verifySession() {

    const token = this.getToken();

    if (!token) return false;

    try {

      const res = await fetch(
        `${API_BASE}/api/admin/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Attempt refresh on 401
      if (res.status === 401) {

        try {

          await this.refreshSession();

          return true;

        } catch {

          return false;
        }
      }

      return res.ok;

    } catch {

      return false;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getEmail() {
    return localStorage.getItem(EMAIL_KEY);
  },

  isOffline() {
    return !import.meta.env.VITE_API_BASE;
  },

  isOfflineMode() {
    return this.isOffline();
  },
};
```
