export const transactionResponse = (transaction) => {
    const interval =
        transaction.isRecurring && transaction.intervalValue != null && transaction.intervalType
            ? { value: transaction.intervalValue, type: transaction.intervalType }
            : undefined;
    const {
        id,
        userId,
        date,
        description,
        type,
        amount,
        isRecurring,
    } = transaction

    return {
        id,
        userId,
        date,
        description,
        type,
        amount,
        isRecurring,
        interval,
        createdAt,
        updatedAt
    };
}