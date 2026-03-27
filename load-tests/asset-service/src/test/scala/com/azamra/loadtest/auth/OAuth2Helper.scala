package com.azamra.loadtest.auth

import com.azamra.loadtest.config.TestConfig

import java.net.URI
import java.net.http.{HttpClient, HttpRequest, HttpResponse}
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

object OAuth2Helper {

  private val httpClient: HttpClient = HttpClient.newHttpClient()

  /** Fetch an OAuth2 token using the password grant. */
  def fetchToken(clientId: String, clientSecret: String, username: String, password: String): String = {
    val params = Map(
      "grant_type" -> "password",
      "client_id" -> clientId,
      "client_secret" -> clientSecret,
      "username" -> username,
      "password" -> password
    )
    requestToken(params)
  }

  /** Fetch an OAuth2 token using the client_credentials grant (for admin/data-loader). */
  def fetchClientToken(clientId: String, clientSecret: String): String = {
    val params = Map(
      "grant_type" -> "client_credentials",
      "client_id" -> clientId,
      "client_secret" -> clientSecret
    )
    requestToken(params)
  }

  private def requestToken(params: Map[String, String]): String = {
    val body = params.map { case (k, v) =>
      URLEncoder.encode(k, StandardCharsets.UTF_8) + "=" + URLEncoder.encode(v, StandardCharsets.UTF_8)
    }.mkString("&")

    val request = HttpRequest.newBuilder()
      .uri(URI.create(TestConfig.tokenUrl))
      .header("Content-Type", "application/x-www-form-urlencoded")
      .POST(HttpRequest.BodyPublishers.ofString(body))
      .build()

    val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())

    if (response.statusCode() != 200) {
      throw new RuntimeException(s"Token request failed (${response.statusCode()}): ${response.body()}")
    }

    // Simple JSON parsing without external dependency
    val tokenPattern = """"access_token"\s*:\s*"([^"]+)"""".r
    tokenPattern.findFirstMatchIn(response.body()) match {
      case Some(m) => m.group(1)
      case None => throw new RuntimeException(s"Could not extract access_token from: ${response.body()}")
    }
  }
}
