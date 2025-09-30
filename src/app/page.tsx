"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Dashboard from "./dashboard";

// Country data with reliable flag image URLs
const countries = [
  // Africa
  {
    code: "GH",
    name: "Ghana",
    flag: "https://flagcdn.com/gh.svg",
    dialCode: "+233",
  },
  {
    code: "NG",
    name: "Nigeria",
    flag: "https://flagcdn.com/ng.svg",
    dialCode: "+234",
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "https://flagcdn.com/ke.svg",
    dialCode: "+254",
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "https://flagcdn.com/za.svg",
    dialCode: "+27",
  },
  {
    code: "EG",
    name: "Egypt",
    flag: "https://flagcdn.com/eg.svg",
    dialCode: "+20",
  },
  {
    code: "CI",
    name: "Ivory Coast",
    flag: "https://flagcdn.com/ci.svg",
    dialCode: "+225",
  },
  {
    code: "SN",
    name: "Senegal",
    flag: "https://flagcdn.com/sn.svg",
    dialCode: "+221",
  },
  {
    code: "ET",
    name: "Ethiopia",
    flag: "https://flagcdn.com/et.svg",
    dialCode: "+251",
  },
  {
    code: "UG",
    name: "Uganda",
    flag: "https://flagcdn.com/ug.svg",
    dialCode: "+256",
  },

  // Americas
  {
    code: "US",
    name: "United States",
    flag: "https://flagcdn.com/us.svg",
    dialCode: "+1",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "https://flagcdn.com/ca.svg",
    dialCode: "+1",
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "https://flagcdn.com/br.svg",
    dialCode: "+55",
  },
  {
    code: "MX",
    name: "Mexico",
    flag: "https://flagcdn.com/mx.svg",
    dialCode: "+52",
  },
  {
    code: "AR",
    name: "Argentina",
    flag: "https://flagcdn.com/ar.svg",
    dialCode: "+54",
  },

  // Europe
  {
    code: "GB",
    name: "United Kingdom",
    flag: "https://flagcdn.com/gb.svg",
    dialCode: "+44",
  },
  {
    code: "FR",
    name: "France",
    flag: "https://flagcdn.com/fr.svg",
    dialCode: "+33",
  },
  {
    code: "DE",
    name: "Germany",
    flag: "https://flagcdn.com/de.svg",
    dialCode: "+49",
  },
  {
    code: "IT",
    name: "Italy",
    flag: "https://flagcdn.com/it.svg",
    dialCode: "+39",
  },
  {
    code: "ES",
    name: "Spain",
    flag: "https://flagcdn.com/es.svg",
    dialCode: "+34",
  },
  {
    code: "RU",
    name: "Russia",
    flag: "https://flagcdn.com/ru.svg",
    dialCode: "+7",
  },

  // Asia
  {
    code: "CN",
    name: "China",
    flag: "https://flagcdn.com/cn.svg",
    dialCode: "+86",
  },
  {
    code: "IN",
    name: "India",
    flag: "https://flagcdn.com/in.svg",
    dialCode: "+91",
  },
  {
    code: "JP",
    name: "Japan",
    flag: "https://flagcdn.com/jp.svg",
    dialCode: "+81",
  },
  {
    code: "KR",
    name: "South Korea",
    flag: "https://flagcdn.com/kr.svg",
    dialCode: "+82",
  },
  {
    code: "PK",
    name: "Pakistan",
    flag: "https://flagcdn.com/pk.svg",
    dialCode: "+92",
  },
  {
    code: "ID",
    name: "Indonesia",
    flag: "https://flagcdn.com/id.svg",
    dialCode: "+62",
  },

  // Middle East
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "https://flagcdn.com/ae.svg",
    dialCode: "+971",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "https://flagcdn.com/sa.svg",
    dialCode: "+966",
  },
  {
    code: "TR",
    name: "Turkey",
    flag: "https://flagcdn.com/tr.svg",
    dialCode: "+90",
  },
  {
    code: "IL",
    name: "Israel",
    flag: "https://flagcdn.com/il.svg",
    dialCode: "+972",
  },
];

interface VerificationState {
  code: string;
  isLoading: boolean;
  countdown: number;
  canResend: boolean;
  error: string;
  success: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string | object;
  statusCode?: number;
}

// Add this interface for forgot password state
interface ForgotPasswordState {
  isLoading: boolean;
  error: string;
  success: string;
  step: "input" | "verification" | "reset";
}

type ActiveTab = "login" | "signup" | "forgot" | "verify";
export default function Home() {
  const [unreadCount, setUnreadCount] = useState(96);
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    otherNames: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    referralType: "",
    referralCode: "",
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Forgot password state
  const [forgotPhoneNumber, setForgotPhoneNumber] = useState("");
  // Add this state to your component
  const [forgotPassword, setForgotPassword] = useState<ForgotPasswordState>({
    isLoading: false,
    error: "",
    success: "",
    step: "input",
  });

  // Check if send code button should be enabled
  const isSendCodeDisabled = forgotPhoneNumber.trim().length === 0;
  // Add this function to handle signup input changes
  const handleSignupChange = (field: string, value: string) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotPhoneNumber.trim()) {
      setForgotPassword((prev) => ({
        ...prev,
        error: "Please enter your phone number",
      }));
      return;
    }

    setForgotPassword((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      // Prepare data according to forgot password schema
      const forgotPasswordPayload = {
        countryShortName: selectedCountry.code,
        phoneNumber: selectedCountry.dialCode + forgotPhoneNumber,
      };

      console.log("Forgot password data:", forgotPasswordPayload); // For debugging

      // Make API call to forgot password endpoint
      const response = await fetch(`/api/authentication/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgotPasswordPayload),
      });

      const result = await response.json();

      if (response.ok) {
        setForgotPassword((prev) => ({
          ...prev,
          success: "Password reset code sent to your phone!",
          step: "verification",
        }));

        // Store the phone number for verification step
        setLoginData({
          phoneNumber: selectedCountry.dialCode + forgotPhoneNumber,
          countryShortName: selectedCountry.code,
        });

        // Start countdown for resend
        setVerification((prev) => ({
          ...prev,
          countdown: 60,
          canResend: false,
        }));
      } else {
        let errorMessage = "Failed to send reset code. Please try again.";

        if (typeof result === "string") {
          errorMessage = result;
        } else if (result.message) {
          errorMessage = String(result.message);
        } else if (result.error) {
          errorMessage = String(result.error);
        }

        setForgotPassword((prev) => ({
          ...prev,
          error: errorMessage,
        }));
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotPassword((prev) => ({
        ...prev,
        error:
          "Network error occurred. Please check your connection and try again.",
      }));
    } finally {
      setForgotPassword((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // SIMPLIFIED: Handle complete password reset in one step
  const handleResetPassword = async () => {
    if (!verification.code || verification.code.length !== 6) {
      setVerification((prev) => ({
        ...prev,
        error: "Please enter a valid 6-digit code",
      }));
      return;
    }

    if (!signupData.password || !signupData.confirmPassword) {
      setForgotPassword((prev) => ({
        ...prev,
        error: "Please enter and confirm your new password",
      }));
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setForgotPassword((prev) => ({
        ...prev,
        error: "Passwords do not match",
      }));
      return;
    }

    setVerification((prev) => ({ ...prev, isLoading: true, error: "" }));
    setForgotPassword((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      const requestBody = {
        phoneNumber: loginData?.phoneNumber,
        countryShortName: loginData?.countryShortName,
        otp: verification.code,
        newPassword: signupData.password,
        confirmPassword: signupData.confirmPassword,
      };

      console.log("Sending complete reset request:", requestBody);

      const response = await fetch(`/api/authentication/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        setForgotPassword((prev) => ({
          ...prev,
          success: "Password reset successfully! You can now login.",
          step: "input",
        }));
        setVerification((prev) => ({
          ...prev,
          success: "Password reset successful!",
        }));

        // Reset form and go back to login
        setTimeout(() => {
          setActiveTab("login");
          setForgotPassword({
            isLoading: false,
            error: "",
            success: "",
            step: "input",
          });
          setSignupData((prev) => ({
            ...prev,
            password: "",
            confirmPassword: "",
          }));
          setForgotPhoneNumber("");
          setOtpDigits(["", "", "", "", "", ""]);
        }, 3000);
      } else {
        let errorMessage = "Failed to reset password. Please try again.";

        if (typeof result === "string") {
          errorMessage = result;
        } else if (result.message) {
          errorMessage = String(result.message);
        } else if (result.error) {
          errorMessage = String(result.error);
        }

        setVerification((prev) => ({
          ...prev,
          error: errorMessage,
        }));
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setVerification((prev) => ({
        ...prev,
        error:
          "Network error occurred. Please check your connection and try again.",
      }));
    } finally {
      setVerification((prev) => ({ ...prev, isLoading: false }));
      setForgotPassword((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Update the handleLoginSubmit function
  const handleLoginSubmit = async () => {
    try {
      // Validate required fields
      if (!phoneNumber || !password) {
        alert("Please enter both phone number and password");
        return;
      }

      // Prepare data according to login schema
      const loginPayload = {
        phoneNumber: selectedCountry.dialCode + phoneNumber, // Combine country code
        password: password,
        countryShortName: selectedCountry.code, // Add country code
      };

      console.log("Login data:", loginPayload); // For debugging

      // In your handleLoginSubmit function:
      const response = await fetch(`/api/authentication/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      });

      const result = await response.json();

      if (response.ok) {
        // Store initial login data and show verification page
        setLoginData(loginPayload);
        setIsLoggedIn(true);

        // Store temporary token if provided
        if (result.data?.token) {
          localStorage.setItem("authToken", result.data.token);
          localStorage.setItem("isVerified", "false");
        }

        // Navigate to verification page instead of showing success alert
        setActiveTab("verify");

        // Start countdown for resend
        setVerification((prev) => ({
          ...prev,
          countdown: 60,
          canResend: false,
          success: "Verification code sent to your phone!",
        }));
      } else {
        alert(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Network error occurred. Please check your connection and try again."
      );
    }
  };

  // Verification state
  const [verification, setVerification] = useState<VerificationState>({
    code: "",
    isLoading: false,
    countdown: 0,
    canResend: false,
    error: "",
    success: "",
  });

  // Countdown timer for resend code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verification.countdown > 0) {
      interval = setInterval(() => {
        setVerification((prev) => ({
          ...prev,
          countdown: prev.countdown - 1,
          canResend: prev.countdown - 1 === 0,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [verification.countdown]);

  // Add this function to handle verification
  const handleVerifyOTP = async () => {
    if (!verification.code || verification.code.length !== 6) {
      setVerification((prev) => ({
        ...prev,
        error: "Please enter a valid 6-digit code",
      }));
      return;
    }

    setVerification((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`/api/authentication/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber: loginData?.phoneNumber,
          otp: verification.code,
        }),
      });

      const result: ApiErrorResponse = await response.json();

      if (response.ok) {
        setVerification((prev) => ({
          ...prev,
          success: "Verification successful!",
        }));

        if ((result as any).data?.token) {
          localStorage.setItem("authToken", (result as any).data.token);
          localStorage.setItem("isVerified", "true");
        }

        setTimeout(() => {
          setShowDashboard(true);
        }, 1500);
      } else {
        // Type-safe error extraction
        const getErrorMessage = (err: ApiErrorResponse): string => {
          if (err.message) return err.message;
          if (typeof err.error === "string") return err.error;
          if (err.error && typeof err.error === "object") {
            return JSON.stringify(err.error);
          }
          return "Verification failed. Please try again.";
        };

        setVerification((prev) => ({
          ...prev,
          error: getErrorMessage(result),
        }));
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerification((prev) => ({
        ...prev,
        error:
          "Network error occurred. Please check your connection and try again.",
      }));
    } finally {
      setVerification((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Add this function to handle resend OTP
  const handleResendOTP = async () => {
    setOtpDigits(["", "", "", "", "", ""]);

    setVerification((prev) => ({
      ...prev,
      isLoading: true,
      error: "",
      code: "",
      countdown: 30,
      canResend: false,
    }));

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`/api/authentication/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber: loginData?.phoneNumber,
        }),
      });

      const result: ApiErrorResponse = await response.json();

      if (response.ok) {
        setVerification((prev) => ({
          ...prev,
          success: "Verification code sent successfully!",
        }));
      } else {
        const getErrorMessage = (err: ApiErrorResponse): string => {
          if (err.message) return err.message;
          if (typeof err.error === "string") return err.error;
          if (err.error && typeof err.error === "object") {
            return JSON.stringify(err.error);
          }
          return "Failed to resend code. Please try again.";
        };

        setVerification((prev) => ({
          ...prev,
          error: getErrorMessage(result),
        }));
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setVerification((prev) => ({
        ...prev,
        error:
          "Network error occurred. Please check your connection and try again.",
      }));
    } finally {
      setVerification((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".country-selector")) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simulate blinking animation for unread messages
  useEffect(() => {
    const interval = setInterval(() => {
      setUnreadCount((prev) => prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add this function to handle signup submission
  const handleSignupSubmit = async () => {
    try {
      // Validate required fields
      if (
        !signupData.firstName ||
        !signupData.lastName ||
        !signupData.phoneNumber ||
        !signupData.password
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Validate password confirmation
      if (signupData.password !== signupData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // Prepare data according to Swagger schema
      const apiData = {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        otherNames: signupData.otherNames || null,
        phoneNumber: selectedCountry.dialCode + signupData.phoneNumber,
        countryShortName: selectedCountry.code,
        password: signupData.password,
        referralType: signupData.referralType || null,
        countryCode: selectedCountry.dialCode,
        countryName: selectedCountry.name,
        referralCode: signupData.referralCode || null,
        email: signupData.email || null,
      };

      console.log("Sending data to API:", apiData); // For debugging

      // Make API call with your actual base URL
      const response = await fetch(`/api/authentication/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        setActiveTab("login");

        // Reset form
        setSignupData({
          firstName: "",
          lastName: "",
          otherNames: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          referralType: "",
          referralCode: "",
        });
      } else {
        alert(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        "Network error occurred. Please check your connection and try again."
      );
    }
  };

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Notification Bar */}
      <div className="bg-black text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          {/* Centered Notification */}
          <span className="text-white text-3xl text-center font-bold">
            NOTIFICATION BAR
          </span>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-800 to-blue-700 text-white px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto">
          {/* Top Row - Welcome & Social Media */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-600">
            {/* Left Side - Welcome Message */}
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-white text-md">
                Welcome to BisaMe online store
              </span>
            </div>

            {/* Right Side - Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Follow us:</span>
              <div className="flex items-center space-x-3">
                {/* Twitter/X */}
                <a
                  href="#"
                  className="text-white hover:text-orange-300 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="#"
                  className="text-white hover:text-orange-300 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="#"
                  className="text-white hover:text-orange-300 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 113.183-4.51v-3.5a6.329 6.329 0 105.8 6.32v-3.572a7.061 7.061 0 003.831 1.171V6.686z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  className="text-white hover:text-orange-300 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  className="text-white hover:text-orange-300 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.816 3.73 13.665 3.73 12.368s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                    <circle cx="12.017" cy="11.987" r="3.323" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Row - Main Navigation Content */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-3xl font-bold flex items-center">
                <span className="text-white bg-blue-900 px-2 py-1 rounded-lg">
                  B
                </span>
                <span className="relative mx-1">
                  <span className="text-orange-400 absolute -top-2 left-0 text-xl">
                    •
                  </span>
                  <span className="text-white">i</span>
                </span>
                <span className="text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  saMe
                </span>
              </div>
            </div>

            {/* Search Section */}
            <div className="flex items-center space-x-3 flex-1 max-w-2xl mx-8">
              {/* Location Search - Reduced width */}
              <div className="relative w-48">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="All Ghana"
                  className="w-full pl-10 pr-8 py-4 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Main Search - Takes remaining width */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="I am looking for..."
                  className="w-full pl-4 pr-12 py-4 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Sell Button */}
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span>SELL</span>
              </button>

              {/* Wishlist */}
              <button className="p-2 hover:bg-blue-600 rounded-lg transition-all duration-200 transform hover:scale-110 group">
                <svg
                  className="w-6 h-6 text-white group-hover:text-orange-300 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* Profile */}
              <button className="p-2 hover:bg-blue-600 rounded-lg transition-all duration-200 transform hover:scale-110 group">
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4 ml-4">
              {/* Services Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 bg-blue-50 border border-blue-200  transition-all duration-200 font-semibold px-3 py-2 rounded-lg hover:bg-white hover:border-blue-300 hover:shadow-md">
                  <span>Services</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Buy/Sell */}
              <button className="bg-white border border-blue-200 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-lg flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Buy/Sell</span>
              </button>

              {/* Customer Support */}
              <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1C6.48 1 2 5.48 2 11v7a3 3 0 003 3h1a2 2 0 002-2v-5a2 2 0 00-2-2H5v-1c0-3.86 3.14-7 7-7s7 3.14 7 7v1h-1a2 2 0 00-2 2v5a2 2 0 002 2h1a3 3 0 003-3v-7c0-5.52-4.48-10-10-10z" />
                </svg>
                <span className="font-semibold">Customer Support</span>
              </div>

              {/* Need Help */}
              <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12"
                    y2="12"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="8" r="1.2" fill="black" />
                </svg>
                <span className="font-semibold">Need Help</span>
              </div>
            </div>
            {/* Right Section */}
            <div className="flex items-center space-x-6">
              {/* Phone Number */}
              <div className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-200 cursor-pointer px-4 py-2 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div className="text-right">
                  <div className="font-semibold">+233 123 456 789</div>
                </div>
              </div>

              {/* Messages with Floating Notification Badge */}
              <div className="relative">
                <button className="w-12 h-12 flex items-center justify-center bg-transparent border border-gray-300 rounded-lg transition-all duration-200 transform hover:scale-110 hover:border-gray-400 group">
                  <svg
                    className="w-6 h-6 text-gray-600 group-hover:text-orange-500 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </button>

                {/* Floating Badge with Multiple Animation Effects */}
                <div className="absolute -top-1 -right-1">
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>

                  {/* Main badge */}
                  <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {unreadCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Login/Signup Container */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-100">
            {/* Verification Container */}
            {activeTab === "verify" && (
              <div className="space-y-6">
                {/* Verification Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-black mb-2">
                    Verify Your Account
                  </h2>
                  <p className="text-gray-700">
                    We sent a verification code to your phone
                  </p>
                </div>

                {/* Error Message */}
                {verification.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{verification.error}</p>
                  </div>
                )}

                {/* Verification Code Input - 6 Boxes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 text-center block">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-center gap-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 1) {
                            const newDigits = [...otpDigits];
                            newDigits[index] = value;
                            setOtpDigits(newDigits);

                            // Update verification code
                            setVerification((prev) => ({
                              ...prev,
                              code: newDigits.join(""),
                            }));

                            // Auto-focus next input
                            if (value && index < 5) {
                              const nextInput = document.getElementById(
                                `otp-${index + 1}`
                              );
                              nextInput?.focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace
                          if (e.key === "Backspace" && !digit && index > 0) {
                            const prevInput = document.getElementById(
                              `otp-${index - 1}`
                            );
                            prevInput?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData
                            .getData("text")
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          const newDigits = pastedData
                            .split("")
                            .concat(Array(6 - pastedData.length).fill(""));
                          setOtpDigits(newDigits.slice(0, 6));
                          setVerification((prev) => ({
                            ...prev,
                            code: newDigits.join(""),
                          }));

                          // Focus last filled input or first empty
                          const nextIndex = Math.min(pastedData.length, 5);
                          const nextInput = document.getElementById(
                            `otp-${nextIndex}`
                          );
                          nextInput?.focus();
                        }}
                        className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50"
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOTP}
                  disabled={
                    verification.isLoading || verification.code.length !== 6
                  }
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 transform shadow-lg flex items-center justify-center space-x-2 ${
                    verification.isLoading || verification.code.length !== 6
                      ? "bg-orange-300 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:scale-105 hover:shadow-xl"
                  }`}
                >
                  {verification.isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>VERIFYING...</span>
                    </>
                  ) : (
                    <>
                      <span>VERIFY ACCOUNT</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </>
                  )}
                </button>

                {/* Resend Code Section */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-3">Didn't receive the code?</p>
                  <span
                    onClick={() => {
                      if (verification.canResend && !verification.isLoading) {
                        handleResendOTP();
                      }
                    }}
                    className={`px-6 py-2 font-semibold transition-all duration-200 cursor-pointer ${
                      !verification.canResend || verification.isLoading
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-orange-500 hover:text-orange-600"
                    }`}
                  >
                    {verification.isLoading
                      ? "SENDING..."
                      : verification.countdown > 0
                      ? `Resend in ${verification.countdown}s`
                      : "Resend code "}
                  </span>
                </div>
              </div>
            )}

            {/* Forgot Password Container */}
            {activeTab === "forgot" && (
              <div className="space-y-6">
                {/* Forgot Password Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-black mb-2">
                    {forgotPassword.step === "input" && "Forgot Password"}
                    {forgotPassword.step === "verification" && "Reset Password"}
                    {forgotPassword.step === "reset" && "Set New Password"}
                  </h2>
                  <p className="text-gray-700">
                    {forgotPassword.step === "input" &&
                      "Enter your mobile phone number associated with your BisaMe account"}
                    {forgotPassword.step === "verification" &&
                      "Enter the verification code and your new password"}
                    {forgotPassword.step === "reset" &&
                      "Enter your new password"}
                  </p>
                </div>

                {/* Error Message */}
                {forgotPassword.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">
                      {forgotPassword.error}
                    </p>
                  </div>
                )}

                {/* Success Message */}
                {forgotPassword.success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 text-sm">
                      {forgotPassword.success}
                    </p>
                  </div>
                )}

                {/* Step 1: Phone Number Input */}
                {forgotPassword.step === "input" && (
                  <>
                    {/* Phone Number Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative country-selector">
                        {/* Country Code Dropdown */}
                        <div
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 cursor-pointer group"
                          onClick={() =>
                            setShowCountryDropdown(!showCountryDropdown)
                          }
                        >
                          <div className="w-6 h-4 rounded overflow-hidden flex items-center justify-center">
                            <Image
                              src={selectedCountry.flag}
                              alt={`${selectedCountry.name} flag`}
                              width={24}
                              height={16}
                              className="w-6 h-4 object-cover"
                            />
                          </div>
                          <span className="text-gray-600 font-medium">
                            {selectedCountry.dialCode}
                          </span>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              showCountryDropdown ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>

                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                          <div className="absolute left-0 top-full mt-1 w-72 max-h-60 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-y-auto">
                            {countries.map((country) => (
                              <div
                                key={country.code}
                                className={`flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                                  selectedCountry.code === country.code
                                    ? "bg-blue-50 border-l-4 border-l-orange-500"
                                    : ""
                                }`}
                                onClick={() => handleCountrySelect(country)}
                              >
                                <div className="w-6 h-4 rounded overflow-hidden flex items-center justify-center">
                                  <Image
                                    src={country.flag}
                                    alt={`${country.name} flag`}
                                    width={24}
                                    height={16}
                                    className="w-6 h-4 object-cover"
                                  />
                                </div>
                                <span className="text-gray-700 font-medium flex-1">
                                  {country.name}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {country.dialCode}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <input
                          type="tel"
                          value={forgotPhoneNumber}
                          onChange={(e) => setForgotPhoneNumber(e.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full pl-28 pr-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Send Code Button */}
                    <button
                      onClick={handleForgotPasswordSubmit}
                      disabled={forgotPassword.isLoading || isSendCodeDisabled}
                      className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 transform shadow-lg flex items-center justify-center space-x-2 ${
                        forgotPassword.isLoading || isSendCodeDisabled
                          ? "bg-orange-300 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:scale-105 hover:shadow-xl"
                      }`}
                    >
                      {forgotPassword.isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>SENDING CODE...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND CODE</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </>
                )}

                {/* Step 2: Verification Code + Password */}
                {forgotPassword.step === "verification" && (
                  <>
                    {/* Verification Code Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 text-center block">
                        Enter Verification Code
                      </label>
                      <div className="flex justify-center gap-3">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            id={`forgot-otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 1) {
                                const newDigits = [...otpDigits];
                                newDigits[index] = value;
                                setOtpDigits(newDigits);

                                // Update verification code
                                setVerification((prev) => ({
                                  ...prev,
                                  code: newDigits.join(""),
                                }));

                                // Auto-focus next input
                                if (value && index < 5) {
                                  const nextInput = document.getElementById(
                                    `forgot-otp-${index + 1}`
                                  );
                                  nextInput?.focus();
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              // Handle backspace
                              if (
                                e.key === "Backspace" &&
                                !digit &&
                                index > 0
                              ) {
                                const prevInput = document.getElementById(
                                  `forgot-otp-${index - 1}`
                                );
                                prevInput?.focus();
                              }
                            }}
                            className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50"
                          />
                        ))}
                      </div>
                    </div>

                    {/* New Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) =>
                            handleSignupChange("password", e.target.value)
                          }
                          placeholder="Enter your new password"
                          className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={signupData.confirmPassword}
                          onChange={(e) =>
                            handleSignupChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          placeholder="Confirm your new password"
                          className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                        <button
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Reset Password Button */}
                    <button
                      onClick={handleResetPassword}
                      disabled={
                        verification.isLoading ||
                        verification.code.length !== 6 ||
                        !signupData.password ||
                        !signupData.confirmPassword
                      }
                      className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 transform shadow-lg flex items-center justify-center space-x-2 ${
                        verification.isLoading ||
                        verification.code.length !== 6 ||
                        !signupData.password ||
                        !signupData.confirmPassword
                          ? "bg-orange-300 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:scale-105 hover:shadow-xl"
                      }`}
                    >
                      {verification.isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>RESETTING...</span>
                        </>
                      ) : (
                        <>
                          <span>RESET PASSWORD</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Resend Code Section */}
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-gray-600 mb-3">
                        Didn't receive the code?
                      </p>
                      <span
                        onClick={() => {
                          if (
                            verification.canResend &&
                            !verification.isLoading
                          ) {
                            handleForgotPasswordSubmit(); // Resend the code
                          }
                        }}
                        className={`px-6 py-2 font-semibold transition-all duration-200 cursor-pointer ${
                          !verification.canResend || verification.isLoading
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-orange-500 hover:text-orange-600"
                        }`}
                      >
                        {verification.isLoading
                          ? "SENDING..."
                          : verification.countdown > 0
                          ? `Resend in ${verification.countdown}s`
                          : "Resend code"}
                      </span>
                    </div>
                  </>
                )}

                {/* Navigation Links - Only show in input step */}
                {forgotPassword.step === "input" && (
                  <div className="text-center space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-gray-600">
                        Already have an account?
                      </span>
                      <button
                        onClick={() => setActiveTab("login")}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                      >
                        Sign In
                      </button>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-gray-600">
                        Don't have an account?
                      </span>
                      <button
                        onClick={() => setActiveTab("signup")}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer Service Note */}
                <p className="text-md text-center text-gray-700 mt-4">
                  You may contact{" "}
                  <span className="text-red-700 font-semibold">
                    Customer Service
                  </span>{" "}
                  for help restoring access to your account
                </p>
              </div>
            )}

            {/* Login/Signup Container - Shows when activeTab is NOT 'forgot' */}
            {activeTab !== "forgot" && activeTab !== "verify" && (
              <>
                {/* Tab Navigation */}
                <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === "login"
                        ? "bg-white text-orange-600 shadow-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab("signup")}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === "signup"
                        ? "bg-white text-orange-600 shadow-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Login Form */}
                {activeTab === "login" && (
                  <div className="space-y-6">
                    {/* Welcome Text */}
                    <div className="text-center mb-8">
                      <h2 className="text-4xl font-bold text-orange-600 mb-2 inline-block relative">
                        Welcome Back!
                        <span className="absolute left-1/2 -bottom-1 w-16 h-1 bg-orange-600 transform -translate-x-1/2 rounded-lg"></span>
                      </h2>
                      <p className="text-gray-700">
                        Ready to continue your journey on{" "}
                        <span className="text-blue-700 font-semibold">
                          BisaMe
                        </span>
                      </p>
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        {/* Country Code Dropdown */}
                        <div
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 cursor-pointer group"
                          onClick={() =>
                            setShowCountryDropdown(!showCountryDropdown)
                          }
                        >
                          <div className="w-6 h-4 rounded overflow-hidden flex items-center justify-center">
                            <Image
                              src={selectedCountry.flag}
                              alt={`${selectedCountry.name} flag`}
                              width={24}
                              height={16}
                              className="w-6 h-4 object-cover"
                            />
                          </div>
                          <span className="text-gray-600 font-medium">
                            {selectedCountry.dialCode}
                          </span>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              showCountryDropdown ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>

                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                          <div className="absolute left-0 top-full mt-1 w-72 max-h-60 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-y-auto">
                            {countries.map((country) => (
                              <div
                                key={country.code}
                                className={`flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                                  selectedCountry.code === country.code
                                    ? "bg-blue-50 border-l-4 border-l-orange-500"
                                    : ""
                                }`}
                                onClick={() => handleCountrySelect(country)}
                              >
                                <div className="w-6 h-4 rounded overflow-hidden flex items-center justify-center">
                                  <Image
                                    src={country.flag}
                                    alt={`${country.name} flag`}
                                    width={24}
                                    height={16}
                                    className="w-6 h-4 object-cover"
                                  />
                                </div>
                                <span className="text-gray-700 font-medium flex-1">
                                  {country.name}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {country.dialCode}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full pl-28 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <button
                          onClick={() => setActiveTab("forgot")}
                          className="text-sm text-blue-700 hover:text-orange-700 font-medium transition-colors duration-200"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Login Button - Updated with deep orange background when active */}
                    <button
                      onClick={handleLoginSubmit}
                      disabled={!phoneNumber.trim()}
                      className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 transform shadow-lg flex items-center justify-center space-x-2 ${
                        !phoneNumber.trim()
                          ? "bg-orange-300 text-white cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700 text-white hover:scale-105 hover:shadow-xl"
                      }`}
                    >
                      <span>SIGN IN</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Signup Form */}
                {activeTab === "signup" && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-orange-600 mb-2">
                        Join BisaMe!
                      </h2>
                      <p className="text-gray-700">
                        Start your journey with{" "}
                        <span className="text-blue-600 font-semibold">
                          BisaMe
                        </span>{" "}
                        today
                      </p>
                    </div>

                    {/* First Name Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={signupData.firstName}
                          onChange={(e) =>
                            handleSignupChange("firstName", e.target.value)
                          }
                          placeholder="Enter your first name"
                          className="w-full pl-4 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Last Name Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={signupData.lastName}
                          onChange={(e) =>
                            handleSignupChange("lastName", e.target.value)
                          }
                          placeholder="Enter your last name"
                          className="w-full pl-4 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Other Names Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Other Names{" "}
                        <span className="text-gray-500 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={signupData.otherNames}
                          onChange={(e) =>
                            handleSignupChange("otherNames", e.target.value)
                          }
                          placeholder="Enter your other names (optional)"
                          className="w-full pl-4 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={signupData.email}
                          onChange={(e) =>
                            handleSignupChange("email", e.target.value)
                          }
                          placeholder="Enter your email address"
                          className="w-full pl-4 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative country-selector">
                        {/* Country Code Dropdown */}
                        <div
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-3 cursor-pointer group"
                          onClick={() =>
                            setShowCountryDropdown(!showCountryDropdown)
                          }
                        >
                          <div className="w-6 h-4 rounded overflow-hidden flex items-center justify-center border border-gray-200">
                            <img
                              src={selectedCountry.flag}
                              alt={`${selectedCountry.name} flag`}
                              className="w-6 h-4 object-cover"
                            />
                          </div>
                          <span className="text-gray-600 font-medium">
                            {selectedCountry.dialCode}
                          </span>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              showCountryDropdown ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>

                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                          <div className="absolute left-0 top-full mt-1 w-72 max-h-60 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-y-auto">
                            {countries.map((country) => (
                              <div
                                key={country.code}
                                className={`flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                                  selectedCountry.code === country.code
                                    ? "bg-blue-50 border-l-4 border-l-orange-500"
                                    : ""
                                }`}
                                onClick={() => handleCountrySelect(country)}
                              >
                                <div className="w-6 h-4 rounded overflow-hidden flex items-center justify-center border border-gray-200">
                                  <img
                                    src={country.flag}
                                    alt={`${country.name} flag`}
                                    className="w-6 h-4 object-cover"
                                  />
                                </div>
                                <span className="text-gray-700 font-medium flex-1">
                                  {country.name}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {country.dialCode}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <input
                          type="tel"
                          value={signupData.phoneNumber}
                          onChange={(e) =>
                            handleSignupChange("phoneNumber", e.target.value)
                          }
                          placeholder="Enter your phone number"
                          className="w-full pl-28 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) =>
                            handleSignupChange("password", e.target.value)
                          }
                          placeholder="Create a password"
                          className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={signupData.confirmPassword}
                          onChange={(e) =>
                            handleSignupChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          placeholder="Confirm your password"
                          className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                        <button
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* How did you hear about us? - Dropdown Version */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        How did you hear about us?
                      </label>
                      <div className="relative">
                        <select
                          value={signupData.referralType}
                          onChange={(e) =>
                            handleSignupChange("referralType", e.target.value)
                          }
                          className="w-full pl-4 pr-10 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 appearance-none"
                        >
                          <option value="">Select an option</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Facebook">Facebook</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Pinterest">Pinterest</option>
                          <option value="Friend">Friend</option>
                          <option value="Search Engine">Search Engine</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Referral Code (Optional) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Referral Code{" "}
                        <span className="text-gray-500 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={signupData.referralCode || ""}
                          onChange={(e) =>
                            handleSignupChange("referralCode", e.target.value)
                          }
                          placeholder="Enter referral code if you have one"
                          className="w-full pl-4 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                      </div>
                    </div>
                    {/* Terms and Conditions */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <button className="text-orange-600 hover:text-orange-700 font-medium">
                          Terms & Conditions
                        </button>{" "}
                        and{" "}
                        <button className="text-orange-600 hover:text-orange-700 font-medium">
                          Privacy Policy
                        </button>
                      </label>
                    </div>

                    <button
                      onClick={handleSignupSubmit}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
                    >
                      <span>SIGN UP</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl font-bold flex items-center">
                  <span className="text-white bg-blue-600 px-2 py-1 rounded-lg">
                    B
                  </span>
                  <span className="relative mx-1">
                    <span className="text-orange-400 absolute -top-1 left-0 text-lg">
                      •
                    </span>
                    <span className="text-white">i</span>
                  </span>
                  <span className="text-white">saMe</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    +233 59309802
                  </span>
                </div>
                <div className="flex items-center space-x-3 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    Koree Mari Link, Achimota Accra
                  </span>
                </div>
                <div className="flex items-center space-x-3 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    bisamecustomersupport
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-400 mb-4 relative inline-block">
                Quick Links
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-orange-400 transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></span>
              </h3>
              <div className="space-y-3">
                {[
                  "WishList",
                  "Customer Support",
                  "About Us",
                  "Privacy Policy",
                  "Terms of Use",
                ].map((link, index) => (
                  <div
                    key={link}
                    className="group cursor-pointer transition-all duration-300 hover:translate-x-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                      {link}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download App */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-400 mb-4">
                Get It Now
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-500 transform hover:-translate-y-1 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-6 h-6 text-gray-800"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L12.866 12l4.832-4.832zM5.864 2.658L16.8 8.99l-2.303 2.303-8.633-8.635z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 group-hover:text-white">
                        Download on
                      </p>
                      <p className="font-bold text-white group-hover:text-white">
                        Google Play
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-500 transform hover:-translate-y-1 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-6 h-6 text-gray-800"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 group-hover:text-white">
                        Download on
                      </p>
                      <p className="font-bold text-white group-hover:text-white">
                        App Store
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-400 mb-4">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Game",
                  "iPhone",
                  "TV",
                  "Asus Laptops",
                  "MacBook",
                  "SSD",
                  "Graphics Card",
                  "Power Bank",
                  "Smart TV",
                  "Speaker",
                  "Tablet",
                  "Microwave",
                  "Samsung",
                ].map((tag, index) => (
                  <span
                    key={tag}
                    className="px-3 py-2 bg-gray-800 rounded-lg text-sm text-gray-300 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer hover:-translate-y-1"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 BisaMe. All rights reserved.
              </div>
              <div className="flex space-x-6">
                {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(
                  (item) => (
                    <span
                      key={item}
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-300 cursor-pointer text-sm"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
