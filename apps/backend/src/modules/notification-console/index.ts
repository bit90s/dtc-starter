import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import ConsoleNotificationProviderService from "./service"

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [ConsoleNotificationProviderService],
})
