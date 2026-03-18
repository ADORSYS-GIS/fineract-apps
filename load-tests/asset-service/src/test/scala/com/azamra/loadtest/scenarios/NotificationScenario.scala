package com.azamra.loadtest.scenarios

import io.gatling.core.Predef._
import io.gatling.http.Predef._

object NotificationScenario {

  val pollNotifications = exec(
    http("Get Notifications")
      .get("/api/v1/notifications")
      .header("Authorization", "Bearer #{token}")
      .check(status.in(200, 204))
  )
  .pause(5, 10)
}
