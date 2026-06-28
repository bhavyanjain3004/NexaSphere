export function validateEnvironment() {
  const required = [
    'CORS_ORIGIN',
    'ADMIN_EVENT_PASSWORD',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length && process.env.NODE_ENV !== 'test') {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}
