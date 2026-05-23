export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievement_definitions: {
        Row: {
          category: string
          description: string
          icon_name: string | null
          id: string
          lottie_key: string | null
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          description: string
          icon_name?: string | null
          id: string
          lottie_key?: string | null
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          description?: string
          icon_name?: string | null
          id?: string
          lottie_key?: string | null
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      aotw_nominations: {
        Row: {
          axolotl_id: string
          considered: boolean
          id: string
          nominated_at: string
          nomination_note: string | null
          nominator_id: string
        }
        Insert: {
          axolotl_id: string
          considered?: boolean
          id?: string
          nominated_at?: string
          nomination_note?: string | null
          nominator_id: string
        }
        Update: {
          axolotl_id?: string
          considered?: boolean
          id?: string
          nominated_at?: string
          nomination_note?: string | null
          nominator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aotw_nominations_axolotl_id_fkey"
            columns: ["axolotl_id"]
            isOneToOne: false
            referencedRelation: "axolotls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aotw_nominations_nominator_id_fkey"
            columns: ["nominator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      aotw_winners: {
        Row: {
          axolotl_id: string
          created_at: string
          feature_photo: string
          feature_story: string
          id: string
          notification_sent: boolean
          owner_id: string
          week_start: string
        }
        Insert: {
          axolotl_id: string
          created_at?: string
          feature_photo: string
          feature_story: string
          id?: string
          notification_sent?: boolean
          owner_id: string
          week_start: string
        }
        Update: {
          axolotl_id?: string
          created_at?: string
          feature_photo?: string
          feature_story?: string
          id?: string
          notification_sent?: boolean
          owner_id?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "aotw_winners_axolotl_id_fkey"
            columns: ["axolotl_id"]
            isOneToOne: false
            referencedRelation: "axolotls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aotw_winners_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      axolotls: {
        Row: {
          adoption_date: string | null
          color_notes: string | null
          created_at: string
          has_chiller: boolean | null
          has_filter: boolean | null
          hatch_date: string | null
          id: string
          is_public: boolean
          last_parameter_log_at: string | null
          morph: Database["public"]["Enums"]["axolotl_morph"]
          name: string
          owner_id: string
          parameter_log_count: number
          passed_date: string | null
          photos: string[] | null
          primary_photo: string | null
          sex: Database["public"]["Enums"]["axolotl_sex"]
          substrate_type: string | null
          tank_name: string | null
          tank_volume_liters: number | null
          updated_at: string
        }
        Insert: {
          adoption_date?: string | null
          color_notes?: string | null
          created_at?: string
          has_chiller?: boolean | null
          has_filter?: boolean | null
          hatch_date?: string | null
          id?: string
          is_public?: boolean
          last_parameter_log_at?: string | null
          morph?: Database["public"]["Enums"]["axolotl_morph"]
          name: string
          owner_id: string
          parameter_log_count?: number
          passed_date?: string | null
          photos?: string[] | null
          primary_photo?: string | null
          sex?: Database["public"]["Enums"]["axolotl_sex"]
          substrate_type?: string | null
          tank_name?: string | null
          tank_volume_liters?: number | null
          updated_at?: string
        }
        Update: {
          adoption_date?: string | null
          color_notes?: string | null
          created_at?: string
          has_chiller?: boolean | null
          has_filter?: boolean | null
          hatch_date?: string | null
          id?: string
          is_public?: boolean
          last_parameter_log_at?: string | null
          morph?: Database["public"]["Enums"]["axolotl_morph"]
          name?: string
          owner_id?: string
          parameter_log_count?: number
          passed_date?: string | null
          photos?: string[] | null
          primary_photo?: string | null
          sex?: Database["public"]["Enums"]["axolotl_sex"]
          substrate_type?: string | null
          tank_name?: string | null
          tank_volume_liters?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "axolotls_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          axolotl_id: string | null
          caption: string | null
          comments_count: number
          created_at: string
          id: string
          is_visible: boolean
          likes_count: number
          photos: string[]
          type: Database["public"]["Enums"]["post_type"]
          updated_at: string
        }
        Insert: {
          author_id: string
          axolotl_id?: string | null
          caption?: string | null
          comments_count?: number
          created_at?: string
          id?: string
          is_visible?: boolean
          likes_count?: number
          photos?: string[]
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string
          axolotl_id?: string | null
          caption?: string | null
          comments_count?: number
          created_at?: string
          id?: string
          is_visible?: boolean
          likes_count?: number
          photos?: string[]
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_axolotl_id_fkey"
            columns: ["axolotl_id"]
            isOneToOne: false
            referencedRelation: "axolotls"
            referencedColumns: ["id"]
          },
        ]
      }
      cycle_sessions: {
        Row: {
          ai_notes: string | null
          axolotl_id: string
          completed_at: string | null
          created_at: string
          current_step: number
          id: string
          is_completed: boolean
          method: Database["public"]["Enums"]["cycle_method"]
          owner_id: string
          started_at: string
          step_data: Json
          updated_at: string
        }
        Insert: {
          ai_notes?: string | null
          axolotl_id: string
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          is_completed?: boolean
          method?: Database["public"]["Enums"]["cycle_method"]
          owner_id: string
          started_at?: string
          step_data?: Json
          updated_at?: string
        }
        Update: {
          ai_notes?: string | null
          axolotl_id?: string
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          is_completed?: boolean
          method?: Database["public"]["Enums"]["cycle_method"]
          owner_id?: string
          started_at?: string
          step_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cycle_sessions_axolotl_id_fkey"
            columns: ["axolotl_id"]
            isOneToOne: false
            referencedRelation: "axolotls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cycle_sessions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_bookmarks: {
        Row: {
          created_at: string
          guide_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          guide_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          guide_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_bookmarks_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          bookmark_count: number
          category: Database["public"]["Enums"]["guide_category"]
          content_markdown: string
          cover_pexels_id: string | null
          cover_url: string | null
          created_at: string
          difficulty: Database["public"]["Enums"]["guide_difficulty"]
          excerpt: string
          featured: boolean
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean
          published_at: string | null
          reading_time_minutes: number
          slug: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          bookmark_count?: number
          category: Database["public"]["Enums"]["guide_category"]
          content_markdown: string
          cover_pexels_id?: string | null
          cover_url?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["guide_difficulty"]
          excerpt: string
          featured?: boolean
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          reading_time_minutes?: number
          slug: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          bookmark_count?: number
          category?: Database["public"]["Enums"]["guide_category"]
          content_markdown?: string
          cover_pexels_id?: string | null
          cover_url?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["guide_difficulty"]
          excerpt?: string
          featured?: boolean
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          reading_time_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      health_logs: {
        Row: {
          ai_diagnosis: Json | null
          axolotl_id: string
          created_at: string
          follow_up_at: string | null
          follow_up_sent: boolean | null
          id: string
          logged_at: string
          outcome: Database["public"]["Enums"]["health_log_outcome"] | null
          outcome_notes: string | null
          owner_id: string
          photos: string[] | null
          resolved_at: string | null
          symptoms: string[] | null
          treatment_given: string | null
          treatment_started_at: string | null
          type: Database["public"]["Enums"]["health_log_type"]
          updated_at: string
        }
        Insert: {
          ai_diagnosis?: Json | null
          axolotl_id: string
          created_at?: string
          follow_up_at?: string | null
          follow_up_sent?: boolean | null
          id?: string
          logged_at?: string
          outcome?: Database["public"]["Enums"]["health_log_outcome"] | null
          outcome_notes?: string | null
          owner_id: string
          photos?: string[] | null
          resolved_at?: string | null
          symptoms?: string[] | null
          treatment_given?: string | null
          treatment_started_at?: string | null
          type: Database["public"]["Enums"]["health_log_type"]
          updated_at?: string
        }
        Update: {
          ai_diagnosis?: Json | null
          axolotl_id?: string
          created_at?: string
          follow_up_at?: string | null
          follow_up_sent?: boolean | null
          id?: string
          logged_at?: string
          outcome?: Database["public"]["Enums"]["health_log_outcome"] | null
          outcome_notes?: string | null
          owner_id?: string
          photos?: string[] | null
          resolved_at?: string | null
          symptoms?: string[] | null
          treatment_given?: string | null
          treatment_started_at?: string | null
          type?: Database["public"]["Enums"]["health_log_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_logs_axolotl_id_fkey"
            columns: ["axolotl_id"]
            isOneToOne: false
            referencedRelation: "axolotls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_logs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          keeper_since: string | null
          location: string | null
          onesignal_player_id: string | null
          revenuecat_user_id: string | null
          subscription_expires_at: string | null
          subscription_tier: string
          total_axolotls_kept: number
          total_parameter_logs: number
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          keeper_since?: string | null
          location?: string | null
          onesignal_player_id?: string | null
          revenuecat_user_id?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string
          total_axolotls_kept?: number
          total_parameter_logs?: number
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          keeper_since?: string | null
          location?: string | null
          onesignal_player_id?: string | null
          revenuecat_user_id?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string
          total_axolotls_kept?: number
          total_parameter_logs?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      tank_alerts: {
        Row: {
          action_url: string | null
          alert_type: Database["public"]["Enums"]["alert_type"]
          axolotl_id: string
          id: string
          message: string
          metadata: Json | null
          owner_id: string
          push_sent: boolean
          push_sent_at: string | null
          read: boolean
          read_at: string | null
          resolved: boolean
          resolved_at: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          triggered_at: string
        }
        Insert: {
          action_url?: string | null
          alert_type: Database["public"]["Enums"]["alert_type"]
          axolotl_id: string
          id?: string
          message: string
          metadata?: Json | null
          owner_id: string
          push_sent?: boolean
          push_sent_at?: string | null
          read?: boolean
          read_at?: string | null
          resolved?: boolean
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title: string
          triggered_at?: string
        }
        Update: {
          action_url?: string | null
          alert_type?: Database["public"]["Enums"]["alert_type"]
          axolotl_id?: string
          id?: string
          message?: string
          metadata?: Json | null
          owner_id?: string
          push_sent?: boolean
          push_sent_at?: string | null
          read?: boolean
          read_at?: string | null
          resolved?: boolean
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          triggered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tank_alerts_axolotl_id_fkey"
            columns: ["axolotl_id"]
            isOneToOne: false
            referencedRelation: "axolotls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tank_alerts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          axolotl_id: string | null
          earned_at: string
          id: string
          notified: boolean
          profile_id: string
        }
        Insert: {
          achievement_id: string
          axolotl_id?: string | null
          earned_at?: string
          id?: string
          notified?: boolean
          profile_id: string
        }
        Update: {
          achievement_id?: string
          axolotl_id?: string | null
          earned_at?: string
          id?: string
          notified?: boolean
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievement_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_axolotl_id_fkey"
            columns: ["axolotl_id"]
            isOneToOne: false
            referencedRelation: "axolotls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      water_parameters: {
        Row: {
          ai_insight: string | null
          ammonia: number | null
          axolotl_id: string
          created_at: string
          dissolved_oxygen: number | null
          gh: number | null
          id: string
          kh: number | null
          logged_at: string
          nitrate: number | null
          nitrite: number | null
          notes: string | null
          owner_id: string
          ph: number | null
          safety_flags: string[] | null
          safety_score: number | null
          tds: number | null
          temperature: number | null
          water_change_percent: number | null
        }
        Insert: {
          ai_insight?: string | null
          ammonia?: number | null
          axolotl_id: string
          created_at?: string
          dissolved_oxygen?: number | null
          gh?: number | null
          id?: string
          kh?: number | null
          logged_at?: string
          nitrate?: number | null
          nitrite?: number | null
          notes?: string | null
          owner_id: string
          ph?: number | null
          safety_flags?: string[] | null
          safety_score?: number | null
          tds?: number | null
          temperature?: number | null
          water_change_percent?: number | null
        }
        Update: {
          ai_insight?: string | null
          ammonia?: number | null
          axolotl_id?: string
          created_at?: string
          dissolved_oxygen?: number | null
          gh?: number | null
          id?: string
          kh?: number | null
          logged_at?: string
          nitrate?: number | null
          nitrite?: number | null
          notes?: string | null
          owner_id?: string
          ph?: number | null
          safety_flags?: string[] | null
          safety_score?: number | null
          tds?: number | null
          temperature?: number | null
          water_change_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "water_parameters_axolotl_id_fkey"
            columns: ["axolotl_id"]
            isOneToOne: false
            referencedRelation: "axolotls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "water_parameters_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      alert_severity: "info" | "warning" | "critical"
      alert_type:
        | "heat_warning"
        | "heat_critical"
        | "ammonia_spike"
        | "nitrite_spike"
        | "parameter_anomaly"
        | "water_change_due"
        | "filter_maintenance_due"
        | "follow_up_due"
        | "birthday"
      axolotl_morph:
        | "leucistic"
        | "golden_albino"
        | "melanoid"
        | "wild_type"
        | "copper"
        | "axanthic"
        | "piebald"
        | "mosaic"
        | "chimera"
        | "gfp"
        | "firefly"
        | "lavender"
        | "enigma"
        | "unknown"
      axolotl_sex: "male" | "female" | "unknown"
      cycle_method: "fish_in" | "fishless_ammonia" | "seeded"
      guide_category:
        | "water_chemistry"
        | "tank_setup"
        | "feeding"
        | "disease"
        | "breeding"
        | "seasonal"
        | "equipment"
        | "morphs"
      guide_difficulty: "beginner" | "intermediate" | "expert"
      health_log_outcome:
        | "resolved"
        | "monitoring"
        | "ongoing"
        | "lost"
        | "unknown"
      health_log_type:
        | "photo_diagnosis"
        | "sos_emergency"
        | "manual_note"
        | "vet_visit"
      post_type: "photo" | "tank_showcase" | "milestone" | "health_update"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      alert_severity: ["info", "warning", "critical"],
      alert_type: [
        "heat_warning",
        "heat_critical",
        "ammonia_spike",
        "nitrite_spike",
        "parameter_anomaly",
        "water_change_due",
        "filter_maintenance_due",
        "follow_up_due",
        "birthday",
      ],
      axolotl_morph: [
        "leucistic",
        "golden_albino",
        "melanoid",
        "wild_type",
        "copper",
        "axanthic",
        "piebald",
        "mosaic",
        "chimera",
        "gfp",
        "firefly",
        "lavender",
        "enigma",
        "unknown",
      ],
      axolotl_sex: ["male", "female", "unknown"],
      cycle_method: ["fish_in", "fishless_ammonia", "seeded"],
      guide_category: [
        "water_chemistry",
        "tank_setup",
        "feeding",
        "disease",
        "breeding",
        "seasonal",
        "equipment",
        "morphs",
      ],
      guide_difficulty: ["beginner", "intermediate", "expert"],
      health_log_outcome: [
        "resolved",
        "monitoring",
        "ongoing",
        "lost",
        "unknown",
      ],
      health_log_type: [
        "photo_diagnosis",
        "sos_emergency",
        "manual_note",
        "vet_visit",
      ],
      post_type: ["photo", "tank_showcase", "milestone", "health_update"],
    },
  },
} as const
