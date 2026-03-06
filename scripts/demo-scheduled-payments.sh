#!/usr/bin/env bash
# =============================================================================
# Demo Scheduled Payments
# Sets asset payment dates to today and triggers the scheduler to create
# PENDING scheduled payments for both bond (COUPON) and non-bond (INCOME).
# You can then confirm/cancel them via the Asset Manager UI.
# =============================================================================
set -euo pipefail

# --- Configuration (override via env vars) ---
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-asset_service}"
DB_USER="${DB_USER:-postgres}"
ASSET_SERVICE_URL="${ASSET_SERVICE_URL:-http://localhost:8083}"
TOKEN="${TOKEN:-}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=== Demo Scheduled Payments ===${NC}"
echo ""

# --- Step 1: Set payment dates to today ---
echo -e "${YELLOW}Step 1: Setting payment dates to today...${NC}"

BOND_SQL="UPDATE assets SET next_coupon_date = CURRENT_DATE WHERE category = 'BONDS' AND status IN ('ACTIVE', 'MATURED') AND next_coupon_date IS NOT NULL;"
INCOME_SQL="UPDATE assets SET next_distribution_date = CURRENT_DATE WHERE category != 'BONDS' AND status = 'ACTIVE' AND income_type IS NOT NULL AND next_distribution_date IS NOT NULL;"

BOND_RESULT=$(psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -t -c "$BOND_SQL" 2>&1)
echo -e "  Bonds (COUPON):     ${GREEN}${BOND_RESULT}${NC}"

INCOME_RESULT=$(psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -t -c "$INCOME_SQL" 2>&1)
echo -e "  Non-bonds (INCOME): ${GREEN}${INCOME_RESULT}${NC}"
echo ""

# --- Step 2: Trigger the scheduler ---
echo -e "${YELLOW}Step 2: Triggering scheduler...${NC}"

AUTH_HEADER=""
if [ -n "$TOKEN" ]; then
  AUTH_HEADER="-H \"Authorization: Bearer $TOKEN\""
fi

RESPONSE=$(eval curl -s -X POST "$ASSET_SERVICE_URL/api/admin/scheduled-payments/run-schedulers" \
  -H "Content-Type: application/json" \
  $AUTH_HEADER)

echo -e "  Response: ${GREEN}${RESPONSE}${NC}"
echo ""

# --- Step 3: List pending payments ---
echo -e "${YELLOW}Step 3: Listing pending payments...${NC}"

PENDING=$(eval curl -s "$ASSET_SERVICE_URL/api/admin/scheduled-payments?status=PENDING&size=50" \
  -H "Content-Type: application/json" \
  $AUTH_HEADER)

if command -v jq &>/dev/null; then
  COUNT=$(echo "$PENDING" | jq '.totalElements // 0')
  echo -e "  Pending count: ${GREEN}${COUNT}${NC}"
  echo ""
  echo "$PENDING" | jq '.content[] | {id, symbol, paymentType, status, holderCount, estimatedTotal}'
else
  echo "$PENDING"
fi

echo ""
echo -e "${CYAN}Done! Open the Asset Manager UI -> Scheduled Payments to confirm or cancel.${NC}"
