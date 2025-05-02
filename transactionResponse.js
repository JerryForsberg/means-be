export const transactionResponse = (transaction) => {
    const {
        id,
        date,
        description,
        type,
        amount,
        isRecurring,
        intervalValue,
        intervalType,
        recurrenceEndDate
    } = transaction;
    return {
        id,
        date,
        description,
        type,
        amount,
        isRecurring,
        intervalValue,
        intervalType,
        recurrenceEndDate
    };

}