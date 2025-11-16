export interface BalanceResponse {
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
