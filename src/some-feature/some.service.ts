// src/some-feature/some.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SomeService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllUsers() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw new Error(error.message);
    return data;
  }
}
