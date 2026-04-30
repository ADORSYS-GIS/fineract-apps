#!/usr/bin/env bash
# =============================================================================
# Cleanup Orphan LP Fineract Accounts
#
# Run AFTER deploying the V3 migration (V3__lp_accounts_to_own_table.sql).
# The migration creates an `orphan_lp_accounts` table listing the per-asset
# Fineract savings accounts that are no longer referenced after LP accounts
# were consolidated to 3 per LP.
#
# This script:
#   1. Reads orphan account IDs from the database
#   2. Withdraws any remaining balance from each orphan account
#   3. Closes each orphan account in Fineract
#   4. Drops the orphan_lp_accounts table once done
#
# Usage:
#   FINERACT_URL=https://fineract.example.com \
#   FINERACT_TOKEN=<bearer-token> \
#   DATABASE_URL=postgresql://user:pass@host:5432/asset_service \
#   ./scripts/cleanup-orphan-lp-accounts.sh
#
# Optional dry-run (prints what would be done, makes no changes):
#   DRY_RUN=true ./scripts/cleanup-orphan-lp-accounts.sh
# =============================================================================
set -euo pipefail

FINERACT_URL="${FINERACT_URL:?FINERACT_URL is required}"
FINERACT_TOKEN="${FINERACT_TOKEN:?FINERACT_TOKEN is required}"
DATABASE_URL="${DATABASE_URL:?DATABASE_URL is required}"
DRY_RUN="${DRY_RUN:-false}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

if [[ "$DRY_RUN" == "true" ]]; then
  warn "DRY RUN mode — no changes will be made to Fineract or the database."
fi

# ---------------------------------------------------------------------------
# Step 1: Dump orphan account IDs from the database
# ---------------------------------------------------------------------------
TMPFILE=$(mktemp /tmp/orphan_lp_accounts.XXXXXX.csv)
trap 'rm -f "$TMPFILE"' EXIT

info "Fetching orphan account IDs from database..."
psql "$DATABASE_URL" -t -A -F',' \
  -c "SELECT account_id, product_type, lp_client_id FROM orphan_lp_accounts ORDER BY lp_client_id, account_id" \
  > "$TMPFILE"

TOTAL=$(wc -l < "$TMPFILE" | tr -d ' ')
if [[ "$TOTAL" -eq 0 ]]; then
  success "No orphan accounts found — nothing to do."
  exit 0
fi

info "Found $TOTAL orphan account(s) to close."
echo ""

TODAY=$(date '+%d %B %Y')
CLOSED=0
FAILED=0

# ---------------------------------------------------------------------------
# Step 2: For each orphan account, withdraw balance then close
# ---------------------------------------------------------------------------
while IFS=',' read -r account_id product_type lp_client_id; do
  [[ -z "$account_id" ]] && continue

  info "Processing account $account_id (type=$product_type, lpClientId=$lp_client_id)..."

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "    [DRY RUN] Would withdraw balance from account $account_id"
    echo "    [DRY RUN] Would close account $account_id"
    ((CLOSED++)) || true
    continue
  fi

  # Withdraw remaining balance (best-effort — account may already be zero)
  WITHDRAW_RESP=$(curl -s -w "\n%{http_code}" -X POST \
    "$FINERACT_URL/fineract-provider/api/v1/savingsaccounts/$account_id/transactions?command=withdrawal" \
    -H "Authorization: Bearer $FINERACT_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"locale\": \"en\",
      \"dateFormat\": \"dd MMMM yyyy\",
      \"transactionDate\": \"$TODAY\",
      \"transactionAmount\": \"0\",
      \"withdrawBalance\": true
    }" 2>/dev/null || echo -e "\n000")

  WITHDRAW_STATUS=$(echo "$WITHDRAW_RESP" | tail -1)
  if [[ "$WITHDRAW_STATUS" == "200" ]]; then
    info "  Withdrew balance from account $account_id"
  elif [[ "$WITHDRAW_STATUS" == "403" || "$WITHDRAW_STATUS" == "400" ]]; then
    warn "  Balance already zero or not withdrawable for account $account_id (HTTP $WITHDRAW_STATUS) — proceeding to close"
  else
    warn "  Withdraw returned HTTP $WITHDRAW_STATUS for account $account_id — proceeding to close anyway"
  fi

  # Close the account
  CLOSE_RESP=$(curl -s -w "\n%{http_code}" -X POST \
    "$FINERACT_URL/fineract-provider/api/v1/savingsaccounts/$account_id?command=close" \
    -H "Authorization: Bearer $FINERACT_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"locale\": \"en\",
      \"dateFormat\": \"dd MMMM yyyy\",
      \"closedOnDate\": \"$TODAY\"
    }" 2>/dev/null || echo -e "\n000")

  CLOSE_STATUS=$(echo "$CLOSE_RESP" | tail -1)
  if [[ "$CLOSE_STATUS" == "200" ]]; then
    success "  Closed account $account_id"
    ((CLOSED++)) || true
  else
    CLOSE_BODY=$(echo "$CLOSE_RESP" | head -1)
    error "  Failed to close account $account_id (HTTP $CLOSE_STATUS): $CLOSE_BODY"
    ((FAILED++)) || true
  fi

done < "$TMPFILE"

echo ""

# ---------------------------------------------------------------------------
# Step 3: Drop the orphan_lp_accounts table if all accounts were processed
# ---------------------------------------------------------------------------
if [[ "$FAILED" -gt 0 ]]; then
  warn "Summary: $CLOSED closed, $FAILED failed."
  warn "Orphan_lp_accounts table NOT dropped — re-run after fixing failures."
  exit 1
fi

info "Summary: $CLOSED account(s) closed successfully."

if [[ "$DRY_RUN" == "true" ]]; then
  warn "[DRY RUN] Would drop orphan_lp_accounts table."
else
  info "Dropping orphan_lp_accounts table..."
  psql "$DATABASE_URL" -c "DROP TABLE IF EXISTS orphan_lp_accounts;"
  success "orphan_lp_accounts table dropped."
fi

success "Cleanup complete."
