package com.azamra.loadtest.setup

import com.azamra.loadtest.auth.OAuth2Helper
import com.azamra.loadtest.config.TestConfig

import java.net.URI
import java.net.http.{HttpClient, HttpRequest, HttpResponse}
import java.time.LocalDate

object TestDataSetup {

  private val httpClient: HttpClient = HttpClient.newHttpClient()

  case class TestAsset(id: String, symbol: String)

  /** Create a test asset, activate it, and return its ID. */
  def setupTestAsset(): TestAsset = {
    val adminToken = OAuth2Helper.fetchClientToken(TestConfig.adminClientId, TestConfig.adminClientSecret)
    val symbol = s"LT-${System.currentTimeMillis() % 100000}"
    val today = LocalDate.now().toString

    // Check if a loadtest asset already exists
    val existingId = findExistingAsset(adminToken, "LT-")
    if (existingId.nonEmpty) {
      println(s"[SETUP] Reusing existing test asset: ${existingId.get}")
      return TestAsset(existingId.get, "LT-EXISTING")
    }

    // Create asset
    val createPayload =
      s"""{
         |  "name": "Load Test Bond $symbol",
         |  "symbol": "$symbol",
         |  "currencyCode": "$symbol",
         |  "description": "Auto-created asset for Gatling load testing",
         |  "category": "GOVERNMENT_BOND",
         |  "issuerPrice": 10000,
         |  "lpBidPrice": 10050,
         |  "lpAskPrice": 10100,
         |  "totalSupply": 1000000,
         |  "decimalPlaces": 0,
         |  "tradingFeePercent": 0.005,
         |  "subscriptionStartDate": "2025-01-01",
         |  "subscriptionEndDate": "2027-12-31",
         |  "incomeType": "COUPON",
         |  "incomeRate": 5.0,
         |  "distributionFrequencyMonths": 6,
         |  "nextDistributionDate": "$today"
         |}""".stripMargin

    val assetId = adminPost(s"/admin/assets", createPayload, adminToken)
    val id = extractJsonField(assetId, "id")
    println(s"[SETUP] Created test asset: $symbol ($id)")

    // Activate asset
    adminPost(s"/admin/assets/$id/activate", "{}", adminToken)
    println(s"[SETUP] Activated test asset: $id")

    TestAsset(id, symbol)
  }

  private def findExistingAsset(token: String, prefix: String): Option[String] = {
    val request = HttpRequest.newBuilder()
      .uri(URI.create(s"${TestConfig.baseUrl}/admin/assets?search=$prefix&size=1"))
      .header("Authorization", s"Bearer $token")
      .GET()
      .build()

    val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
    if (response.statusCode() == 200) {
      val idPattern = """"id"\s*:\s*"([^"]+)"""".r
      idPattern.findFirstMatchIn(response.body()).map(_.group(1))
    } else {
      None
    }
  }

  private def adminPost(endpoint: String, body: String, token: String): String = {
    val request = HttpRequest.newBuilder()
      .uri(URI.create(s"${TestConfig.baseUrl}$endpoint"))
      .header("Authorization", s"Bearer $token")
      .header("Content-Type", "application/json")
      .POST(HttpRequest.BodyPublishers.ofString(body))
      .build()

    val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
    if (response.statusCode() >= 400) {
      throw new RuntimeException(s"Admin API $endpoint failed (${response.statusCode()}): ${response.body()}")
    }
    response.body()
  }

  private def extractJsonField(json: String, field: String): String = {
    val pattern = s""""$field"\\s*:\\s*"([^"]+)"""".r
    pattern.findFirstMatchIn(json) match {
      case Some(m) => m.group(1)
      case None => throw new RuntimeException(s"Could not extract '$field' from: $json")
    }
  }
}
