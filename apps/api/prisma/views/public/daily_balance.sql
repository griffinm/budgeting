WITH date_series AS (
  SELECT
    accounts.connected_account_id,
    (
      generate_series(
        date_trunc(
          'month' :: text,
          (
            SELECT
              min(trn.date) AS min
            FROM
              account_transactions trn
            WHERE
              (
                trn.connected_account_id = accounts.connected_account_id
              )
          )
        ),
        (CURRENT_DATE) :: timestamp without time zone,
        '1 day' :: INTERVAL
      )
    ) :: date AS date
  FROM
    (
      SELECT
        DISTINCT account_transactions.connected_account_id
      FROM
        account_transactions
    ) accounts
)
SELECT
  connected_account_id,
  date,
  round(
    COALESCE(
      (
        SELECT
          (sum(trn.amount)) :: numeric AS sum
        FROM
          account_transactions trn
        WHERE
          (
            (
              trn.connected_account_id = ds.connected_account_id
            )
            AND (trn.date <= ds.date)
          )
      ),
      (0) :: numeric
    ),
    2
  ) AS running_balance
FROM
  date_series ds
GROUP BY
  connected_account_id,
  date
ORDER BY
  connected_account_id,
  date;