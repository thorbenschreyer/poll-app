import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  private supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  async testConnection() {
  const { data, error } = await this.supabase
    .from('surveys')
    .select('*');

  console.log('Supabase Daten:', data);
  console.log('Supabase Fehler:', error);
}
}
