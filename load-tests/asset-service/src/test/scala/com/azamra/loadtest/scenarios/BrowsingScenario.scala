package com.azamra.loadtest.scenarios

import io.gatling.core.Predef._
import io.gatling.http.Predef._

object BrowsingScenario {

  val browse = exec(
    http("List Assets")
      .get("/api/v1/assets")
      .header("Authorization", "Bearer #{token}")
      .check(status.is(200))
      .check(
        jsonPath("$.content[0].id").optional.saveAs("firstAssetId"),
        jsonPath("$[0].id").optional.saveAs("firstAssetIdAlt")
      )
  ).exec(session => {
    val assetId = session("firstAssetId").asOption[String]
      .orElse(session("firstAssetIdAlt").asOption[String])
      .getOrElse(session("testAssetId").as[String])
    session.set("browseAssetId", assetId)
  })
  .pause(1, 3)
  .exec(
    http("Get Asset Detail")
      .get("/api/v1/assets/#{browseAssetId}")
      .header("Authorization", "Bearer #{token}")
      .check(status.is(200))
  )
  .pause(1, 3)
  .exec(
    http("List Favorites")
      .get("/api/v1/favorites")
      .header("Authorization", "Bearer #{token}")
      .check(status.in(200, 204))
  )
}
