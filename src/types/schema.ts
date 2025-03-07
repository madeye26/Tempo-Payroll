export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          monthly_incentives: number;
          position: string | null;
          department: string | null;
          base_salary: number;
          join_date: string;
          status: "active" | "inactive";
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          monthly_incentives?: number;
          position?: string | null;
          department?: string | null;
          base_salary: number;
          join_date: string;
          status?: "active" | "inactive";
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          monthly_incentives?: number;
          position?: string | null;
          department?: string | null;
          base_salary?: number;
          join_date?: string;
          status?: "active" | "inactive";
        };
      };
      salary_components: {
        Row: {
          id: string;
          created_at: string;
          employee_id: string;
          month: string;
          year: number;
          bonus: number;
          allowances: number;
          deductions: number;
          purchases: number;
          loans: number;
          absences: number;
          overtime_hours: number;
          penalty_days: number;
          net_salary: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          employee_id: string;
          month: string;
          year: number;
          bonus?: number;
          allowances?: number;
          deductions?: number;
          purchases?: number;
          loans?: number;
          absences?: number;
          overtime_hours?: number;
          penalty_days?: number;
          net_salary: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          employee_id?: string;
          month?: string;
          year?: number;
          bonus?: number;
          allowances?: number;
          deductions?: number;
          purchases?: number;
          loans?: number;
          absences?: number;
          overtime_hours?: number;
          penalty_days?: number;
          net_salary?: number;
        };
      };
      advances: {
        Row: {
          id: string;
          created_at: string;
          employee_id: string;
          amount: number;
          remaining_amount: number;
          request_date: string;
          expected_repayment_date: string;
          actual_repayment_date: string | null;
          status: "pending" | "paid" | "delayed";
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          employee_id: string;
          amount: number;
          remaining_amount: number;
          request_date: string;
          expected_repayment_date: string;
          actual_repayment_date?: string | null;
          status?: "pending" | "paid" | "delayed";
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          employee_id?: string;
          amount?: number;
          remaining_amount?: number;
          request_date?: string;
          expected_repayment_date?: string;
          actual_repayment_date?: string | null;
          status?: "pending" | "paid" | "delayed";
          notes?: string | null;
        };
      };
      attendance: {
        Row: {
          id: string;
          created_at: string;
          employee_id: string;
          date: string;
          status: "present" | "absent" | "leave" | "late";
          check_in: string | null;
          check_out: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          employee_id: string;
          date: string;
          status: "present" | "absent" | "leave" | "late";
          check_in?: string | null;
          check_out?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          employee_id?: string;
          date?: string;
          status?: "present" | "absent" | "leave" | "late";
          check_in?: string | null;
          check_out?: string | null;
          notes?: string | null;
        };
      };
      leaves: {
        Row: {
          id: string;
          created_at: string;
          employee_id: string;
          start_date: string;
          end_date: string;
          reason: string | null;
          type: "sick" | "annual" | "unpaid" | "other";
          status: "pending" | "approved" | "rejected";
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          employee_id: string;
          start_date: string;
          end_date: string;
          reason?: string | null;
          type: "sick" | "annual" | "unpaid" | "other";
          status?: "pending" | "approved" | "rejected";
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          employee_id?: string;
          start_date?: string;
          end_date?: string;
          reason?: string | null;
          type?: "sick" | "annual" | "unpaid" | "other";
          status?: "pending" | "approved" | "rejected";
          notes?: string | null;
        };
      };
      salary_formulas: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string | null;
          formula: string;
          variables: Json;
          is_default: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description?: string | null;
          formula: string;
          variables: Json;
          is_default?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string | null;
          formula?: string;
          variables?: Json;
          is_default?: boolean;
        };
      };
      performance_evaluations: {
        Row: {
          id: string;
          created_at: string;
          employee_id: string;
          evaluation_date: string;
          criteria: Json;
          overall_rating: number;
          overall_comments: string | null;
          evaluator: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          employee_id: string;
          evaluation_date: string;
          criteria: Json;
          overall_rating: number;
          overall_comments?: string | null;
          evaluator?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          employee_id?: string;
          evaluation_date?: string;
          criteria?: Json;
          overall_rating?: number;
          overall_comments?: string | null;
          evaluator?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
