export const transactionResponse = (transaction) => {
    const interval =
        transaction.isRecurring && transaction.intervalValue != null && transaction.intervalType
            ? { value: transaction.intervalValue, type: transaction.intervalType }
            : undefined;

    return {
        id: raw.id,
        userId: raw.userId,
        date: raw.date,
        description: raw.description,
        type: raw.type,
        amount: raw.amount,
        isRecurring: raw.isRecurring,
        interval,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
    };
}