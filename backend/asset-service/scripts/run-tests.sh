#!/usr/bin/env bash
# =============================================================================
# Asset Service Test Runner
# Wipes docker volumes, starts fresh postgres + redis, runs the full test suite.
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

# Java 21 via sdkman (Lombok requires < Java 25)
JAVA21="${HOME}/.sdkman/candidates/java/21.0.2-open"
if [ -d "$JAVA21" ]; then
  export JAVA_HOME="$JAVA21"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=== Asset Service Test Runner ===${NC}"
echo ""

# --- Step 1: Wipe volumes ---
echo -e "${YELLOW}[1/4] Tearing down containers and volumes...${NC}"
docker compose -f "$COMPOSE_FILE" down -v --remove-orphans 2>&1 | grep -v "^time="
echo ""

# --- Step 2: Start postgres + redis only ---
echo -e "${YELLOW}[2/4] Starting postgres and redis...${NC}"
docker compose -f "$COMPOSE_FILE" up -d postgres redis 2>&1 | grep -v "^time="
echo ""

# --- Step 3: Wait for postgres ---
echo -e "${YELLOW}[3/4] Waiting for postgres to be ready...${NC}"
RETRIES=30
until docker compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U asset_service -q 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo -e "${RED}Postgres did not become ready in time. Aborting.${NC}"
    exit 1
  fi
  sleep 1
done
echo -e "${GREEN}Postgres ready.${NC}"
echo ""

# --- Step 4: Run tests ---
echo -e "${YELLOW}[4/4] Running test suite...${NC}"
echo ""
cd "$PROJECT_DIR"
mvn test "$@"

EXIT_CODE=$?
echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}All tests passed.${NC}"
else
  echo -e "${RED}Tests FAILED (exit $EXIT_CODE).${NC}"
fi

exit $EXIT_CODE
