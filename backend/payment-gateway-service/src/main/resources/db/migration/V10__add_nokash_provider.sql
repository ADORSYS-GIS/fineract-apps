ALTER TABLE payment_transactions DROP CONSTRAINT chk_provider;
ALTER TABLE payment_transactions ADD CONSTRAINT chk_provider CHECK (provider IN ('MTN_MOMO', 'ORANGE_MONEY', 'CINETPAY', 'NOKASH'));
