export const hideAccountId = (accountId) => {
  return (
    accountId.substring(0, 4) +
    '...' +
    accountId.substring(accountId.length - 4, accountId.length)
  );
};
