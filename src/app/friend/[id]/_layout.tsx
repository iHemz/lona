import { Stack } from "expo-router";

// Its own stack inside the modal, so "View profile" pushes within the sheet.
export default function FriendLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
