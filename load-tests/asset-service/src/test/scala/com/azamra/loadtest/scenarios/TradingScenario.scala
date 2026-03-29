package com.azamra.loadtest.scenarios

import io.gatling.core.Predef._
import io.gatling.http.Predef._

object TradingScenario {

  // Generate a unique idempotency key per request
  val genIdempotencyKey = exec(session =>
    session.set("idempotencyKey", java.util.UUID.randomUUID().toString)
  )

  val trade = exec(genIdempotencyKey)
  .exec(
    http("Get Trade Quote")
      .post("/api/v1/trades/quote")
      .header("Authorization", "Bearer #{token}")
      .header("Content-Type", "application/json")
      .header("X-Idempotency-Key", "#{idempotencyKey}")
      .body(StringBody("""{"assetId": "#{testAssetId}", "side": "BUY", "units": 1}"""))
      .check(status.in(200, 201))
      .check(jsonPath("$.orderId").optional.saveAs("quoteOrderId"))
  )
  .pause(2, 5)
  .doIf(session => session.contains("quoteOrderId")) {
    exec(genIdempotencyKey)
    .exec(
      http("Confirm Trade Order")
        .post("/api/v1/trades/orders/#{quoteOrderId}/confirm")
        .header("Authorization", "Bearer #{token}")
        .header("Content-Type", "application/json")
        .header("X-Idempotency-Key", "#{idempotencyKey}")
        .body(StringBody("{}"))
        .check(status.in(200, 201, 202, 204))
    )
  }
  .pause(2, 3)
  .exec(
    http("List Trade Orders")
      .get("/api/v1/trades/orders?size=10")
      .header("Authorization", "Bearer #{token}")
      .check(status.in(200, 204))
      .check(jsonPath("$.content[0].id").optional.saveAs("listedOrderId"))
  )
  .pause(1, 2)
  .doIf(session => session.contains("listedOrderId")) {
    exec(
      http("Get Order Detail")
        .get("/api/v1/trades/orders/#{listedOrderId}")
        .header("Authorization", "Bearer #{token}")
        .check(status.is(200))
    )
  }
}
