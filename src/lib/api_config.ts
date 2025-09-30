// lib/api-config.ts
export const getApiBaseUrl = () => {
  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // Use HTTPS in production, HTTP in development
  if (process.env.NODE_ENV === "production") {
    return "http://195.35.36.122:1991";
  }

  return "http://195.35.36.122:1991";
};

export const API_BASE_URL = getApiBaseUrl();
