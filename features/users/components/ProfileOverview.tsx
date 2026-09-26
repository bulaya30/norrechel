import ProfileAboutCard from "./ProfileAboutCard";
import ProfileContactCard from "./ProfileContactCard";
import ProfileProfessionalCard from "./ProfileProfessionalCard";
import ProfileAccountCard from "./ProfileAccountCard";
import ProfileSocialCard from "./ProfileSocialCard";

import type { User } from "@/features/interfaces/user";

interface ProfileOverviewProps {
  user: User;
}

export default function ProfileOverview({
  user,
}: ProfileOverviewProps) {
  return (
    <div className="space-y-6">
      {/* About + Contact */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.8fr)]">
        <ProfileAboutCard user={user} />

        <ProfileContactCard user={user} />
      </div>

      {/* Professional + Account */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileProfessionalCard user={user} />

        <ProfileAccountCard user={user} />
      </div>

      {/* Social Profiles */}
      <ProfileSocialCard user={user} />
    </div>
  );
}
