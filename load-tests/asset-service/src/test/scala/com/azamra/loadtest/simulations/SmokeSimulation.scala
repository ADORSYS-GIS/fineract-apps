package com.azamra.loadtest.simulations

import com.azamra.loadtest.auth.OAuth2Helper
import com.azamra.loadtest.config.TestConfig
import com.azamra.loadtest.scenarios._
import com.azamra.loadtest.setup.TestDataSetup
import io.gatling.core.Predef._
import io.gatling.http.Predef._

import scala.concurrent.duration._

class SmokeSimulation extends Simulation {

  private var token: String = _
  private var testAssetId: String = _

  before {
    println("[SMOKE] Setting up test data...")
    token = OAuth2Helper.fetchToken(TestConfig.clientId, TestConfig.clientSecret, TestConfig.username, TestConfig.password)
    val asset = TestDataSetup.setupTestAsset()
    testAssetId = asset.id
    println(s"[SMOKE] Ready. Asset: $testAssetId")
  }

  val httpProtocol = http.baseUrl(TestConfig.assetServiceUrl)

  val smokeScenario = scenario("Smoke Test - All Endpoints")
    .exec(session => session.set("token", token).set("testAssetId", testAssetId))
    .during(30.seconds) {
      exec(BrowsingScenario.browse)
        .pause(1, 2)
        .exec(PortfolioScenario.checkPortfolio)
        .pause(1, 2)
        .exec(TradingScenario.trade)
        .pause(1, 2)
        .exec(NotificationScenario.pollNotifications)
    }

  setUp(
    smokeScenario.inject(atOnceUsers(1))
  ).protocols(httpProtocol)
    .assertions(
      global.responseTime.percentile(95).lt(500),
      global.failedRequests.percent.lt(1.0)
    )
}
