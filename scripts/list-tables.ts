import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yoqgvuwtseoctwwjlapy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_ylO1Hcbb3J6gcY0AwUfg5w_KDhuHm0e';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    console.log('🔍 Listing tables in public schema...');

    const { data, error } = await supabase
        .rpc('get_tables'); // This might not work if RPC is not defined

    if (error) {
        console.error('RPC failed, trying raw query via information_schema...');
        // Fallback: use a simple query that might reveal table names
        const { data: tables, error: infoError } = await supabase
            .from('pg_tables') // This won't work either via PostgREST
            .select('*')
            .eq('schemaname', 'public');

        if (infoError) {
            console.error('Direct table listing failed. Trying to insert into common names...');
            // Let's just try 'users' or 'User' or 'user'
            const { error: test1 } = await supabase.from('users').select('count', { count: 'exact', head: true });
            const { error: test2 } = await supabase.from('User').select('count', { count: 'exact', head: true });
            const { error: test3 } = await supabase.from('user').select('count', { count: 'exact', head: true });

            console.log('Test "users":', test1 ? test1.message : 'OK');
            console.log('Test "User":', test2 ? test2.message : 'OK');
            console.log('Test "user":', test3 ? test3.message : 'OK');
        } else {
            console.table(tables);
        }
    } else {
        console.table(data);
    }
}

main();
