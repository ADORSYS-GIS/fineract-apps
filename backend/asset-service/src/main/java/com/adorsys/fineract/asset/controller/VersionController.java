package com.adorsys.fineract.asset.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class VersionController {

    @Value("${git.commit.id.abbrev:unknown}")
    private String commitId;

    @Value("${git.branch:unknown}")
    private String branch;

    @GetMapping("/api/version")
    public Map<String, String> getVersion() {
        return Map.of(
            "commit", commitId,
            "branch", branch
        );
    }
}
