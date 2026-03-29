package com.azamra.loadtest.simulations

import com.azamra.loadtest.auth.OAuth2Helper
import com.azamra.loadtest.config.TestConfig
import com.azamra.loadtest.scenarios._
import com.azamra.loadtest.setup.TestDataSetup
import io.gatling.core.Predef._
import io.gatling.http.Predef._

import scala.concurrent.duration._

class LoadSimulation extends Simulation {

  private var token: String = _
  private var testAssetId: String = _

  before {
    println("[LOAD] Setting up test data...")
    token = OAuth2Helper.fetchToken(TestConfig.clientId, TestConfig.clientSecret, TestConfig.username, TestConfig.password)
    val asset = TestDataSetup.setupTestAsset()
    testAssetId = asset.id
    println(s"[LOAD] Ready. Asset: $testAssetId")
  }

  val httpProtocol = http.baseUrl(TestConfig.assetServiceUrl)

  val injectToken = exec(session => session.set("token", token).set("testAssetId", testAssetId))

  val readers = scenario("Readers - Browse Assets")
    .exec(injectToken)
    .during(5.minutes) {
      exec(BrowsingScenario.browse)
        .pause(1, 3)
    }

  val portfolioCheckers = scenario("Portfolio Checkers")
    .exec(injectToken)
    .during(5.minutes) {
      exec(PortfolioScenario.checkPortfolio)
        .pause(2, 4)
    }

  val traders = scenario("Traders - Buy/Sell")
    .exec(injectToken)
    .during(5.minutes) {
      exec(TradingScenario.trade)
        .pause(2, 5)
    }

  val notificationPollers = scenario("Notification Pollers")
    .exec(injectToken)
    .during(5.minutes) {
      exec(NotificationScenario.pollNotifications)
    }

  setUp(
    readers.inject(atOnceUsers(10)),
    portfolioCheckers.inject(atOnceUsers(3)),
    traders.inject(atOnceUsers(5)),
    notificationPollers.inject(atOnceUsers(2))
  ).protocols(httpProtocol)
    .assertions(
      global.responseTime.percentile(99).lt(500),
      global.failedRequests.percent.lt(0.1)
    )
}
