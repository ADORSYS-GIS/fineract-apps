package com.azamra.loadtest.scenarios

import io.gatling.core.Predef._
import io.gatling.http.Predef._

object PortfolioScenario {

  val checkPortfolio = exec(
    http("Get Portfolio")
      .get("/api/v1/portfolio")
      .header("Authorization", "Bearer #{token}")
      .check(status.in(200, 204))
  )
  .pause(2, 4)
  .exec(
    http("Get Income Calendar")
      .get("/api/v1/portfolio/income-calendar?months=12")
      .header("Authorization", "Bearer #{token}")
      .check(status.in(200, 204))
  )
}
