import { Contact, ContactField, getPermissionsAsync, requestPermissionsAsync } from "expo-contacts";
import { useEffect, useEffectEvent, useState } from "react";
import { AppState, Linking, Platform } from "react-native";

import { toPhoneContacts, type PhoneContact } from "@/lib/contacts";

const FIELDS = [ContactField.FULL_NAME, ContactField.PHONES] as const;

/**
 * `checking` until we know the permission; `ask` before the user has decided; `blocked` once
 * only Settings can grant it; `unavailable` where there's no address book (web).
 */
export type ContactsAccess = "checking" | "ask" | "blocked" | "granted" | "unavailable";

export type PhoneContacts = {
  access: ContactsAccess;
  contacts: PhoneContact[];
  isLoading: boolean;
  /** Asks for permission (or opens Settings once blocked), then loads the address book. */
  connect: () => void;
};

export function usePhoneContacts(): PhoneContacts {
  const [access, setAccess] = useState<ContactsAccess>(
    Platform.OS === "web" ? "unavailable" : "checking",
  );
  const [contacts, setContacts] = useState<PhoneContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      setContacts(toPhoneContacts(await Contact.getAllDetails(FIELDS)));
    } catch {
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const apply = async (permission: Awaited<ReturnType<typeof getPermissionsAsync>> | null) => {
    if (permission?.granted) {
      setAccess("granted");
      await load();
    } else {
      setAccess(permission && !permission.canAskAgain ? "blocked" : "ask");
    }
  };

  const check = useEffectEvent(() => {
    void getPermissionsAsync()
      .catch(() => null)
      .then(apply);
  });

  useEffect(() => {
    if (Platform.OS === "web") return;
    check();
  }, []);

  // If they went to Settings and allowed contacts, pick that up when they come back.
  useEffect(() => {
    if (access !== "blocked") return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") check();
    });
    return () => subscription.remove();
  }, [access]);

  const connect = () => {
    if (access === "blocked") {
      void Linking.openSettings();
      return;
    }
    if (access !== "ask") return;
    void requestPermissionsAsync()
      .catch(() => null)
      .then(apply);
  };

  return { access, contacts, isLoading, connect };
}
