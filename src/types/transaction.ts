export interface BalanceResponse {
  id: string;
  balance: number;
}

export interface TopupPayload {
  email: string;
  top_up_amount: number;
}

export interface PaymentPayload {
  email: string;
  service_code: string;
}

export interface PaymentResponse {
  invoice_number: string;
  service_code: string;
  service_name: string;
  transaction_type: string;
  total_amount: number;
}

export interface TransactionLog {
  user_id: string;
  transaction_type_id: string;
  invoice_number: string;
  description: string;
  total_amount: number;
  balance_before: number;
  balance_after: number;
}

export interface TransactionLogResponse {
  invoice_number: string;
  transaction_type: string;
  description: string;
  total_amount: number;
  created_on: string;
}
