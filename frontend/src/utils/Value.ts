


export const parseAmountToString = (input: number | string) => {
    if (typeof input === "number") {
      return input.toString();
    } else if (typeof input === "string") {
      const numericAmount = parseFloat(input.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(numericAmount)) {
        return numericAmount.toFixed(2);
      }
    }
  
    throw new Error("Invalid input format. Please provide a valid number or a valid currency amount string.");
  };

export const formatAmount = (amount:  string ):number =>{
    const value = typeof amount === 'number' ? amount : parseAmountToString(amount);
 
      const numericAmount = parseFloat(value);
    
      if (isNaN(numericAmount)) {
        throw new Error("Invalid input format. Please provide a valid currency amount string.");
      }
    
      return numericAmount;
}

export const formatCurrency = (amount:number) => {
    if (typeof amount !== "number") {
      throw new Error("Invalid input type. Please provide a valid number.");
    }
  
    const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${formattedAmount}`;
  };
