/** Someone from the phone's address book, reduced to what we need to offer them a loan. */
export type PhoneContact = {
  id: string;
  name: string;
  /** As stored on the phone; formats vary (e.g. "07700 900118", "+44 7700 900118"). */
  phone: string;
};

type RawContact = {
  id: string;
  fullName: string | null;
  phones: { number?: string }[] | null;
};

/** Contacts with a name and at least one phone number (the first one is used), A–Z. */
export function toPhoneContacts(raw: RawContact[]): PhoneContact[] {
  const contacts: PhoneContact[] = [];
  for (const contact of raw) {
    const name = contact.fullName?.trim();
    const phone = contact.phones?.find((candidate) => candidate.number?.trim())?.number?.trim();
    if (name && phone) contacts.push({ id: contact.id, name, phone });
  }
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}
