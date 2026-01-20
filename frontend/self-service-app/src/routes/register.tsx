import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("register.errors.required");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("register.errors.required");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("register.errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("register.errors.invalidEmail");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("register.errors.required");
    } else if (!/^(\+237)?[6-9]\d{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = t("register.errors.invalidPhone");
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t("register.errors.required");
    }

    if (!formData.gender) {
      newErrors.gender = t("register.errors.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REGISTRATION_API_URL || "/api"}/registration/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      setSubmitSuccess(true);
      // Redirect to login after a delay
      setTimeout(() => {
        navigate({ to: "/" });
      }, 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("register.success")}
          </h2>
          <p className="text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("register.title")}</h1>
          <p className="text-gray-500 mt-2">{t("auth.registerSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="label">
                {t("register.firstName")}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`input ${errors.firstName ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="label">
                {t("register.lastName")}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`input ${errors.lastName ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">
              {t("register.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="label">
              {t("register.phone")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+237 6XX XXX XXX"
              value={formData.phone}
              onChange={handleChange}
              className={`input ${errors.phone ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="label">
              {t("register.dateOfBirth")}
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`input ${errors.dateOfBirth ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label htmlFor="gender" className="label">
              {t("register.gender")}
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`input ${errors.gender ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            >
              <option value="">Select...</option>
              <option value="male">{t("register.male")}</option>
              <option value="female">{t("register.female")}</option>
            </select>
            {errors.gender && <p className="error-text">{errors.gender}</p>}
          </div>

          {submitError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? t("common.loading") : t("register.submit")}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          {t("register.haveAccount")}{" "}
          <a href="/self-service" className="text-blue-600 hover:underline">
            {t("auth.login")}
          </a>
        </p>
      </div>
    </div>
  );
}
