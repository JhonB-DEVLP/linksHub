import { PublicProfilePage } from "@/components/public-profile/profile-page"

interface PublicProfilePageProps {
  params: {
    username: string
  }
}

export default function PublicProfile({ params }: PublicProfilePageProps) {
  return <PublicProfilePage username={params.username} />
}
