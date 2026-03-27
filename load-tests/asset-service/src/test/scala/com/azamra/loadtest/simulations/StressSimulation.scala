package com.azamra.loadtest.simulations

import com.azamra.loadtest.auth.OAuth2Helper
import com.azamra.loadtest.config.TestConfig
import com.azamra.loadtest.scenarios._
import com.azamra.loadtest.setup.TestDataSetup
import io.gatling.core.Predef._
import io.gatling.http.Predef._

import scala.concurrent.duration._

class StressSimulation extends Simulation {

  private var token: String = _
  private var testAssetId: String = _

  before {
    println("[STRESS] Setting up test data...")
    token = OAuth2Helper.fetchToken(TestConfig.clientId, TestConfig.clientSecret, TestConfig.username, TestConfig.password)
    val asset = TestDataSetup.setupTestAsset()
    testAssetId = asset.id
    println(s"[STRESS] Ready. Asset: $testAssetId")
  }

  val httpProtocol = http.baseUrl(TestConfig.assetServiceUrl)

  val injectToken = exec(session => session.set("token", token).set("testAssetId", testAssetId))

  val mixedScenario = scenario("Stress - Mixed Workload")
    .exec(injectToken)
    .randomSwitch(
      50.0 -> exec(BrowsingScenario.browse),
      20.0 -> exec(PortfolioScenario.checkPortfolio),
      25.0 -> exec(TradingScenario.trade),
      5.0  -> exec(NotificationScenario.pollNotifications)
    )
    .pause(0, 1)

  setUp(
    mixedScenario.inject(
      // Ramp to 50 users over 2 minutes
      rampUsers(50).during(2.minutes),
      // Hold at ~50 for 5 minutes
      nothingFor(5.minutes),
      // Ramp to 100 users over 2 minutes (50 more)
      rampUsers(50).during(2.minutes),
      // Hold at ~100 for 3 minutes
      nothingFor(3.minutes),
      // Ramp down over 1 minute
      rampUsers(5).during(1.minute)
    )
  ).protocols(httpProtocol)
  // No hard assertions for stress tests — use reports to analyze breaking point
}
