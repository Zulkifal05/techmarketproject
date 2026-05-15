import Link from "next/link";
import Image from "next/image";
import { User } from "@techmarket/models/dist/UserModel"

type ProfileAvatarProps = {
  user: User & { _id?: string };
};

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  return (
    <Link
      href={`/Profile/${user?._id}`}
      className="block w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:scale-105 transition-transform"
    >
      <Image
        src={user?.profilePicture || "/Default-Avatar.png"}
        alt={`${user?.name} profile`}
        width={40}
        height={40}
        className="w-full h-full object-cover"
      />
    </Link>
  );
}