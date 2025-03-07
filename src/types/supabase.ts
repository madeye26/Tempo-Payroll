export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advances: {
        Row: {
          actual_repayment_date: string | null
          amount: number
          created_at: string | null
          employee_id: string
          expected_repayment_date: string
          id: string
          notes: string | null
          remaining_amount: number
          request_date: string
          status: string | null
        }
        Insert: {
          actual_repayment_date?: string | null
          amount: number
          created_at?: string | null
          employee_id: string
          expected_repayment_date: string
          id?: string
          notes?: string | null
          remaining_amount: number
          request_date: string
          status?: string | null
        }
        Update: {
          actual_repayment_date?: string | null
          amount?: number
          created_at?: string | null
          employee_id?: string
          expected_repayment_date?: string
          id?: string
          notes?: string | null
          remaining_amount?: number
          request_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          base_salary: number
          created_at: string | null
          department: string | null
          id: string
          join_date: string
          monthly_incentives: number | null
          name: string
          position: string | null
          status: string | null
        }
        Insert: {
          base_salary: number
          created_at?: string | null
          department?: string | null
          id?: string
          join_date: string
          monthly_incentives?: number | null
          name: string
          position?: string | null
          status?: string | null
        }
        Update: {
          base_salary?: number
          created_at?: string | null
          department?: string | null
          id?: string
          join_date?: string
          monthly_incentives?: number | null
          name?: string
          position?: string | null
          status?: string | null
        }
        Relationships: []
      }
      leaves: {
        Row: {
          created_at: string | null
          employee_id: string
          end_date: string
          id: string
          notes: string | null
          reason: string | null
          start_date: string
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          end_date: string
          id?: string
          notes?: string | null
          reason?: string | null
          start_date: string
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          notes?: string | null
          reason?: string | null
          start_date?: string
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_evaluations: {
        Row: {
          created_at: string | null
          criteria: Json
          employee_id: string
          evaluation_date: string
          evaluator: string | null
          id: string
          overall_comments: string | null
          overall_rating: number
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          employee_id: string
          evaluation_date: string
          evaluator?: string | null
          id?: string
          overall_comments?: string | null
          overall_rating: number
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          employee_id?: string
          evaluation_date?: string
          evaluator?: string | null
          id?: string
          overall_comments?: string | null
          overall_rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "performance_evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_components: {
        Row: {
          absences: number | null
          allowances: number | null
          bonus: number | null
          created_at: string | null
          deductions: number | null
          employee_id: string
          id: string
          loans: number | null
          month: string
          net_salary: number
          overtime_hours: number | null
          penalty_days: number | null
          purchases: number | null
          year: number
        }
        Insert: {
          absences?: number | null
          allowances?: number | null
          bonus?: number | null
          created_at?: string | null
          deductions?: number | null
          employee_id: string
          id?: string
          loans?: number | null
          month: string
          net_salary: number
          overtime_hours?: number | null
          penalty_days?: number | null
          purchases?: number | null
          year: number
        }
        Update: {
          absences?: number | null
          allowances?: number | null
          bonus?: number | null
          created_at?: string | null
          deductions?: number | null
          employee_id?: string
          id?: string
          loans?: number | null
          month?: string
          net_salary?: number
          overtime_hours?: number | null
          penalty_days?: number | null
          purchases?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "salary_components_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_formulas: {
        Row: {
          created_at: string | null
          description: string | null
          formula: string
          id: string
          is_default: boolean | null
          name: string
          variables: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          formula: string
          id?: string
          is_default?: boolean | null
          name: string
          variables: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          formula?: string
          id?: string
          is_default?: boolean | null
          name?: string
          variables?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
