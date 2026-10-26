import { LinkList } from "@/components/ui/link-list";

/** Nice-to-have setup that never blocks money moving. */
export function OptionalSetup() {
  return (
    <LinkList
      items={[
        {
          label: "Add a profile photo",
          icon: { ios: "camera", android: "photo_camera", web: "photo_camera" },
          value: "Optional",
        },
        {
          label: "Connect contacts",
          icon: { ios: "person.crop.rectangle.stack", android: "contacts", web: "contacts" },
          value: "Optional",
        },
      ]}
    />
  );
}
