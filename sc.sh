#!/bin/bash
# Script: check-malicious-npm-packages.sh
# Purpose: Scans for known malicious npm packages and versions from the debug/chalk supply chain attack.
# Usage: ./check-malicious-npm-packages.sh [path-to-projects-root]
# If no path is provided, it will only check global npm packages.
# Define the list of malicious packages and their versions.
# Format: "package_name:malicious_version1,malicious_version2"
MALICIOUS_PACKAGES=(
    "debug:4.1.2,4.1.3"
    "chalk:5.1.2,5.1.3"
    "devtools-web:2.1.1"
    "node-downloader-helper:2.1.5"
    "@docusaurus/core:3.1.2"
    "@flowforge/flowforge:2.1.1"
    "@standard/async:3.1.2"
    # eslint-config-* is handled separately due to its pattern
)
# List of known malicious eslint config prefixes (from the initial vector)
MALICIOUS_ESLINT_PREFIXES=(
    "eslint-config-"
)
# Text colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
# Variable to track if any issue is found
FOUND_ISSUE=0
# Function to check a given directory for malicious packages
check_directory() {
    local dir="$1"
    local is_global="$2" # "global" or empty
    echo -e "${YELLOW}Checking ${is_global}npm dependencies in: $dir${NC}"
    if [[ ! -d "$dir" || ! -f "$dir/package.json" ]]; then
        echo "  -> No Node.js project found (no package.json). Skipping."
        return 0
    fi
    # Get the package-lock.json or npm-shrinkwrap.json if it exists, else use package.json
    local lock_file="$dir/package-lock.json"
    if [[ ! -f "$lock_file" ]]; then
        lock_file="$dir/npm-shrinkwrap.json"
    fi
    if [[ ! -f "$lock_file" ]]; then
        lock_file="$dir/package.json"
        echo -e "  ${YELLOW}Warning: No lockfile found. Using package.json. Versions may be ambiguous.${NC}"
    fi
    # Check each malicious package
    for pkg_rule in "${MALICIOUS_PACKAGES[@]}"; do
        IFS=':' read -r pkg_name malicious_versions <<< "$pkg_rule"
        IFS=',' read -ra version_list <<< "$malicious_versions"
        # Use npm ls to find the installed version, quietly, and only show the version
        # This command gets the version from the actual node_modules tree
        local installed_version=$(cd "$dir" && npm ls "$pkg_name" --depth=0 --json 2>/dev/null | grep -oP '"version": "\K[^"]+' | head -1)
        if [[ -n "$installed_version" && "$installed_version" != "null" ]]; then
            # Check if the installed version is in the malicious list
            for bad_version in "${version_list[@]}"; do
                if [[ "$installed_version" == "$bad_version" ]]; then
                    echo -e "  ${RED}CRITICAL: Found malicious package $pkg_name@$installed_version in $dir${NC}"
                    FOUND_ISSUE=1
                    bad_version_found=true
                    break
                fi
            done
            if [[ ! $bad_version_found ]]; then
                echo -e "  ${GREEN}OK: Package $pkg_name found, but version $installed_version is not known to be malicious.${NC}"
            fi
            unset bad_version_found
        fi
    done
    # Check for any eslint-config-* packages that might be malicious
    # This is a broader check and might yield false positives, but is important for awareness.
    local eslint_packages=$(cd "$dir" && npm ls --depth=0 --json 2>/dev/null | grep -oP '"eslint-config-[^"]+":' | sed 's/[":]//g')
    for eslint_pkg in $eslint_packages; do
        echo -e "  ${YELLOW}INFO: Found $eslint_pkg. Please manually verify the source of this eslint config package.${NC}"
        # This doesn't set FOUND_ISSUE=1 as it's only a warning, but you might want to in a strict environment.
    done
}
# ------- Main Execution Starts Here -------
echo -e "${YELLOW}Starting scan for malicious npm packages...${NC}"
echo ""
# 1. Check Global npm packages
GLOBAL_NPM_PATH=$(npm root -g)
check_directory "$GLOBAL_NPM_PATH" "global "
echo "----------------------------------------"
# 2. Check Local Projects
PROJECTS_ROOT="${1:-$PWD}" # Use first script argument or current working directory
# If the provided path is a single project, check it.
if [[ -f "$PROJECTS_ROOT/package.json" ]]; then
    check_directory "$PROJECTS_ROOT"
else
    # Otherwise, loop through all subdirectories and check each one that looks like a Node.js project.
    echo -e "${YELLOW}Scanning for local projects in: $PROJECTS_ROOT${NC}"
    while IFS= read -r -d $'\0' dir; do
        check_directory "$dir"
        echo "---"
    done < <(find "$PROJECTS_ROOT" -name "package.json" -type f -print0 | xargs -0 dirname)
fi
echo "----------------------------------------"
# 3. Final Summary
if [[ $FOUND_ISSUE -eq 1 ]]; then
    echo -e "${RED}****************************************${NC}"
    echo -e "${RED}* CRITICAL: Malicious packages found! *${NC}"
    echo -e "${RED}****************************************${NC}"
    echo -e ""
    echo -e "Immediate Actions:"
    echo -e "1. DO NOT run any builds or transactions from affected machines."
    echo -e "2. On infected systems:"
    echo -e "   a. Identify and remove the malicious package versions."
    echo -e "   b. Rotate ALL API keys, passwords, and secrets from a known clean machine."
    echo -e "   c. Consider a security audit of recent transactions if used with crypto/Web3."
    echo -e "3. Update your dependencies to the latest safe versions."
    exit 1
else
    echo -e "${GREEN}Scan complete. No known malicious packages were detected.${NC}"
    echo -e "${YELLOW}Note: This script cannot guarantee complete safety. Always practice good security hygiene.${NC}"
    exit 0
fi
