type PhoneEntry = { number: string };

export function formatAllPhoneNumbers(settings: {
  phone?: string;
  phoneNumbersSales?: PhoneEntry[];
  faxNumbersSales?: PhoneEntry[];
  phoneNumbersAdmin?: PhoneEntry[];
  faxNumbersAdmin?: PhoneEntry[];
}): string {
  const numbers = [
    ...(settings.phoneNumbersSales || []).map((p) => p.number),
    ...(settings.faxNumbersSales || []).map((p) => p.number),
    ...(settings.phoneNumbersAdmin || []).map((p) => p.number),
    ...(settings.faxNumbersAdmin || []).map((p) => p.number),
  ].filter(Boolean);

  if (numbers.length > 0) {
    return numbers.join(" / ");
  }

  return settings.phone || "";
}
