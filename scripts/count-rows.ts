import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yoqgvuwtseoctwwjlapy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_ylO1Hcbb3J6gcY0AwUfg5w_KDhuHm0e';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function check(tableName: string) {
    const { count, error } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
    if (error) return `Error: ${error.message}`;
    return `Rows: ${count}`;
}

async function main() {
    console.log('User:', await check('User'));
    console.log('users:', await check('users'));
    console.log('user:', await check('user'));

    // Check Organization too
    console.log('Organization:', await check('Organization'));
    console.log('organizations:', await check('organizations'));
}

main();
