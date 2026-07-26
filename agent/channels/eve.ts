import { localDev, none, vercelOidc } from "eve/channels/auth"
import { eveChannel } from "eve/channels/eve"

export default eveChannel({
  auth: [
    vercelOidc(),
    localDev(),
    // Public demo — replace with Auth.js / Clerk in production
    none(),
  ],
})
