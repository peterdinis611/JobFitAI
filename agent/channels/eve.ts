import { eveChannel } from "eve/channels/eve"
import { localDev, none, vercelOidc } from "eve/channels/auth"

export default eveChannel({
  auth: [
    vercelOidc(),
    localDev(),
    // Public demo — replace with Auth.js / Clerk in production
    none(),
  ],
})
