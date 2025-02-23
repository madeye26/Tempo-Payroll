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
          email: string;
          position: string;
          department: string;
          base_salary: number;
          join_date: string;
          status: "active" | "inactive";
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          position: string;
          department: string;
          base_salary: number;
          join_date: string;
          status?: "active" | "inactive";
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          position?: string;
          department?: string;
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
          net_salary?: number;
        };
      };
    };
  };
}
