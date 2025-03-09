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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string
          details: Json | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description: string
          details?: Json | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string
          details?: Json | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
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
      report_metadata: {
        Row: {
          created_at: string | null
          department: string | null
          generated_by: string
          id: string
          month: string | null
          period_type: string
          report_data: Json
          template_id: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          generated_by: string
          id?: string
          month?: string | null
          period_type: string
          report_data: Json
          template_id?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          department?: string | null
          generated_by?: string
          id?: string
          month?: string | null
          period_type?: string
          report_data?: Json
          template_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "report_metadata_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          created_at: string | null
          description: string | null
          format: Json
          id: string
          is_default: boolean | null
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          format: Json
          id?: string
          is_default?: boolean | null
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          format?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
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
      salary_statistics: {
        Row: {
          average_salary: number
          created_at: string | null
          department: string | null
          id: string
          month: string | null
          period_type: string
          total_absences: number
          total_advances: number
          total_base_salary: number
          total_bonuses: number
          total_deductions: number
          total_employees: number
          total_incentives: number
          total_net_salary: number
          total_overtime: number
          total_penalty_days: number
          total_purchases: number
          year: number
        }
        Insert: {
          average_salary: number
          created_at?: string | null
          department?: string | null
          id?: string
          month?: string | null
          period_type: string
          total_absences: number
          total_advances: number
          total_base_salary: number
          total_bonuses: number
          total_deductions: number
          total_employees: number
          total_incentives: number
          total_net_salary: number
          total_overtime: number
          total_penalty_days: number
          total_purchases: number
          year: number
        }
        Update: {
          average_salary?: number
          created_at?: string | null
          department?: string | null
          id?: string
          month?: string | null
          period_type?: string
          total_absences?: number
          total_advances?: number
          total_base_salary?: number
          total_bonuses?: number
          total_deductions?: number
          total_employees?: number
          total_incentives?: number
          total_net_salary?: number
          total_overtime?: number
          total_penalty_days?: number
          total_purchases?: number
          year?: number
        }
        Relationships: []
      }
      system_activities: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          employee_id: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          related_id: string | null
          related_table: string | null
          status: string | null
          timestamp: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action?: string
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          related_id?: string | null
          related_table?: string | null
          status?: string | null
          timestamp?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          related_id?: string | null
          related_table?: string | null
          status?: string | null
          timestamp?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_activities_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          priority: string | null
          status: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          priority?: string | null
          status?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          employee_id: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          role_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          employee_id?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
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
