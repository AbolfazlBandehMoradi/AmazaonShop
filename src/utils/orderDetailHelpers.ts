import type { OrderDetail, OrderShippingAddress } from "@/types/order.types";

export function parseAddressJson(addressJson?: string): Record<string, unknown> | null {
  if (!addressJson) return null;
  try {
    return JSON.parse(addressJson) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function pickString(record: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function resolveAddressFromJson(addressJson?: string): OrderShippingAddress | null {
  const parsed = parseAddressJson(addressJson);
  if (!parsed) return null;

  const firstName = pickString(parsed, "firstName", "FirstName");
  const lastName = pickString(parsed, "lastName", "LastName");
  const fullName =
    pickString(parsed, "fullName", "FullName", "name", "Name") ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    undefined;

  return {
    title: pickString(parsed, "title", "Title"),
    fullName,
    firstName,
    lastName,
    phone: pickString(parsed, "phone", "Phone", "phoneNumber", "PhoneNumber"),
    alternativePhone: pickString(
      parsed,
      "alternativePhone",
      "AlternativePhone",
      "alternativePhoneNumber",
      "AlternativePhoneNumber"
    ),
    email: pickString(parsed, "email", "Email"),
    addressLine1: pickString(
      parsed,
      "addressLine1",
      "AddressLine1",
      "line1",
      "Line1",
      "streetAddress1",
      "StreetAddress1"
    ),
    addressLine2: pickString(
      parsed,
      "addressLine2",
      "AddressLine2",
      "line2",
      "Line2",
      "streetAddress2",
      "StreetAddress2"
    ),
    city: pickString(parsed, "city", "City", "cityName", "CityName"),
    province: pickString(
      parsed,
      "state",
      "State",
      "province",
      "Province",
      "provinceName",
      "ProvinceName"
    ),
    postalCode: pickString(parsed, "postalCode", "PostalCode", "postal", "Postal"),
    country: pickString(parsed, "country", "Country", "countryName", "CountryName"),
    additionalDetails: pickString(parsed, "additionalDetails", "AdditionalDetails"),
  };
}

export function resolveShippingAddress(order: OrderDetail): OrderShippingAddress | null {
  if (order.shippingAddress) {
    return order.shippingAddress;
  }
  return resolveAddressFromJson(order.shippingAddressJson);
}

export function formatOrderDateTime(
  value: string | undefined,
  locale: string | undefined
): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(locale || undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function translateOrderStatus(
  status: string,
  t: (key: string) => string
): string {
  const key = `profile.orders.status${status}`;
  const translated = t(key);
  return translated !== key ? translated : status;
}

export function translatePaymentStatus(
  status: string,
  t: (key: string) => string
): string {
  const key = `profile.orders.paymentStatus${status}`;
  const translated = t(key);
  return translated !== key ? translated : status;
}

export function orderStatusTone(status: string): string {
  switch (status) {
    case "Pending":
      return "bg-status-warning text-status-warning border-status-warning";
    case "Processing":
      return "bg-status-info text-status-info border-status-info";
    case "Completed":
      return "bg-status-success text-status-success border-status-success";
    case "Cancelled":
      return "bg-status-danger text-status-danger border-status-danger";
    default:
      return "border-color-theme bg-color-for-layer-sec first-text-color-for-paragraph";
  }
}

export function paymentStatusTone(status: string): string {
  switch (status) {
    case "Pending":
      return "bg-status-warning text-status-warning border-status-warning";
    case "Paid":
      return "bg-status-success text-status-success border-status-success";
    case "Failed":
      return "bg-status-danger text-status-danger border-status-danger";
    default:
      return "border-color-theme bg-color-for-layer-sec first-text-color-for-paragraph";
  }
}
