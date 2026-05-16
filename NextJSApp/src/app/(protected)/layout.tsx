import ZustandHydrater from "@/components/ZustandHydrater"
import { redirect } from "next/navigation"
import Header from "@/components/header/Header"
import Footer from "@/components/footer/Footer"
import { getUser } from "@/services/server/GetUser"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getUser()

  if(!user) {
    redirect("/Login")
  }

  return (
    <ZustandHydrater user={user}>
      <Header user={user}/>
      {children}
      <Footer />
    </ZustandHydrater>
  )
}