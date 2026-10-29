import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FriendRow } from "@/components/friends/friend-row";
import { ContactsPrompt } from "@/components/lend/contacts-prompt";
import { InviteBanner } from "@/components/lend/invite-banner";
import { GroupedRow, GroupedSeparator } from "@/components/ui/grouped-list";
import { PERSON_ROW_INSET, PersonRow } from "@/components/ui/person-row";
import { SearchBar } from "@/components/ui/search-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { StepHeading, StepNavBar } from "@/components/ui/step-header";
import { FontSize, Spacing } from "@/constants/theme";
import { useLedger } from "@/hooks/use-ledger";
import { useLendDraft } from "@/hooks/use-lend-draft";
import { usePhoneContacts } from "@/hooks/use-phone-contacts";
import { useThemeColors } from "@/hooks/use-theme";
import {
  lendStepHeading,
  recipientKey,
  recipientSections,
  type Recipient,
  type RecipientSection,
  type RecipientSectionKey,
} from "@/lib/lend";

export default function ChooseFriendScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { friends, today } = useLedger();
  const phoneContacts = usePhoneContacts();
  const { update } = useLendDraft();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<ReadonlySet<RecipientSectionKey>>(new Set());

  const sections = recipientSections({
    friends,
    contacts: phoneContacts.contacts,
    query,
    expanded,
  });

  const expand = (key: RecipientSectionKey) => setExpanded((current) => new Set(current).add(key));

  const choose = (recipient: Recipient) => {
    update({ recipient });
    router.push("/lend/plan");
  };

  const emptyMessage = (section: RecipientSection): string | null => {
    if (section.matchCount > 0) return null;
    if (query.trim()) return `No one matches “${query.trim()}”.`;
    return section.key === "friends"
      ? "None of your friends are on Lona yet."
      : "No contacts with a phone number.";
  };

  const renderSectionFooter = (section: RecipientSection) => {
    if (section.key === "contacts" && phoneContacts.access !== "granted") {
      return phoneContacts.access === "checking" ? (
        <ActivityIndicator style={styles.loading} color={colors.textSecondary} />
      ) : (
        <ContactsPrompt access={phoneContacts.access} onConnect={phoneContacts.connect} />
      );
    }
    if (section.key === "contacts" && phoneContacts.isLoading) {
      return <ActivityIndicator style={styles.loading} color={colors.textSecondary} />;
    }
    const message = emptyMessage(section);
    return message ? (
      <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>{message}</Text>
    ) : null;
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm },
      ]}
    >
      <StepNavBar />
      <SectionList
        sections={sections}
        keyExtractor={recipientKey}
        renderItem={({ item, index, section }) => (
          <GroupedRow index={index} count={section.data.length}>
            {item.kind === "friend" ? (
              <FriendRow
                friend={item.friend}
                today={today}
                onPress={() => choose(item)}
                showChevron
              />
            ) : (
              <PersonRow
                name={item.contact.name}
                detail={item.contact.phone}
                colorKey={item.contact.id}
                onPress={() => choose(item)}
                showChevron
              />
            )}
          </GroupedRow>
        )}
        ItemSeparatorComponent={() => <GroupedSeparator inset={PERSON_ROW_INSET} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <SectionHeader
              title={section.title}
              action={
                section.hasMore
                  ? {
                      label: "See all",
                      accessibilityLabel: `See all ${section.title.toLowerCase()}`,
                      onPress: () => expand(section.key),
                    }
                  : undefined
              }
            />
          </View>
        )}
        renderSectionFooter={({ section }) => renderSectionFooter(section)}
        ListHeaderComponent={
          <View style={styles.header}>
            <StepHeading
              {...lendStepHeading(1)}
              title="Who are you lending to?"
              subtitle="Pick a friend from Lona or your contacts."
            />
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search friends or contacts"
              accessibilityLabel="Search friends or contacts by name"
            />
            {phoneContacts.access !== "granted" && <InviteBanner />}
          </View>
        }
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxxl }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  header: {
    gap: Spacing.xl,
  },
  sectionHeader: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  emptyMessage: {
    fontSize: FontSize.subhead,
    textAlign: "center",
    paddingVertical: Spacing.lg,
  },
  loading: {
    paddingVertical: Spacing.xl,
  },
});
