// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
        'https://zxdjidxzvagyeapzguam.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZGppZHh6dmFneWVhcHpndWFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4MzA0MiwiZXhwIjoyMDY1MDU5MDQyfQ.FWKd0r2ijjM_RgQhDEk-cujk2xxZo_-YSgYOCPZ3OVA' // Use service role for upload
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
