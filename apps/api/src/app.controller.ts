// import { Controller, Get } from '@nestjs/common';
// import { SupabaseService } from './supabase/supabase.service';

// @Controller()
// export class AppController {
//   constructor(
//     private readonly supabaseService: SupabaseService,
//   ) { }

//   @Get()
//   getHello() {
//     return {
//       message: 'AI Workspace API funcionando',
//     };
//   }

//   @Get('supabase-test')
//   async testSupabase() {
//     const { data, error } = await this.supabaseService
//       .getClient()
//       .from('profiles')
//       .select('*')
//       .limit(1);

//     return {
//       success: !error,
//       data,
//       error: error?.message ?? null,
//     };
//   }
// }

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'AI Workspace API funcionando correctamente',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'ai-workspace-api',
    };
  }
}