import { PERSON_ROW_INSET, PersonRow } from "@/components/ui/person-row";
import { formatTimeAgo, type IsoDate } from "@/lib/dates";
import type { Friend } from "@/lib/loans";

export const FRIEND_ROW_INSET = PERSON_ROW_INSET;

type FriendRowProps = {
  friend: Friend;
  today: IsoDate;
  onPress?: () => void;
  showChevron?: boolean;
};

export function FriendRow({ friend, today, onPress, showChevron }: FriendRowProps) {
  return (
    <PersonRow
      name={friend.name}
      detail={`Joined ${formatTimeAgo(friend.joinedOn, today)}`}
      colorKey={friend.id}
      onPress={onPress}
      showChevron={showChevron}
    />
  );
}
