package com.azamra.loadtest.simulations

import com.azamra.loadtest.auth.OAuth2Helper
import com.azamra.loadtest.config.TestConfig
import com.azamra.loadtest.scenarios._
import com.azamra.loadtest.setup.TestDataSetup
import io.gatling.core.Predef._
import io.gatling.http.Predef._

import scala.concurrent.duration._

class SoakSimulation extends Simulation {

  @volatile private var token: String = _
  private var testAssetId: String = _
  @volatile private var tokenRefreshCount: Int = 0

  before {
    println("[SOAK] Setting up test data...")
    token = OAuth2Helper.fetchToken(TestConfig.clientId, TestConfig.clientSecret, TestConfig.username, TestConfig.password)
    val asset = TestDataSetup.setupTestAsset()
    testAssetId = asset.id
    println(s"[SOAK] Ready. Duration: ${TestConfig.soakDuration} min, Asset: $testAssetId")
  }

  val httpProtocol = http.baseUrl(TestConfig.assetServiceUrl)

  // Refresh token every ~50 iterations to handle token expiry during long soak tests
  val refreshToken = exec(session => {
    val counter = session("iterationCount").asOption[Int].getOrElse(0) + 1
    val updatedSession = session.set("iterationCount", counter)
    if (counter % 50 == 0) {
      try {
        token = OAuth2Helper.fetchToken(TestConfig.clientId, TestConfig.clientSecret, TestConfig.username, TestConfig.password)
        tokenRefreshCount += 1
        println(s"[SOAK] Token refreshed (refresh #$tokenRefreshCount)")
        updatedSession.set("token", token)
      } catch {
        case e: Exception =>
          println(s"[SOAK] Token refresh failed: ${e.getMessage}")
          updatedSession
      }
    } else {
      updatedSession
    }
  })

  val injectToken = exec(session => session.set("token", token).set("testAssetId", testAssetId).set("iterationCount", 0))

  val soakDuration = TestConfig.soakDuration.minutes

  val soakScenario = scenario("Soak - Extended Duration")
    .exec(injectToken)
    .during(soakDuration) {
      exec(refreshToken)
        .randomSwitch(
          50.0 -> exec(BrowsingScenario.browse),
          20.0 -> exec(PortfolioScenario.checkPortfolio),
          25.0 -> exec(TradingScenario.trade),
          5.0  -> exec(NotificationScenario.pollNotifications)
        )
        .pause(1, 2)
    }

  setUp(
    soakScenario.inject(atOnceUsers(10))
  ).protocols(httpProtocol)
    .assertions(
      global.responseTime.percentile(99).lt(1000),
      global.failedRequests.percent.lt(1.0)
    )
}
