import { localDev, vercelOidc } from "eve/channels/auth"
import { eveChannel } from "eve/channels/eve"
import { clerkRouteAuth } from "#lib/eve-clerk-auth"

export default eveChannel({
  auth: [clerkRouteAuth, vercelOidc(), localDev()],
})
